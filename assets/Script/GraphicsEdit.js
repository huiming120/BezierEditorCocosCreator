cc.Class({
    extends: cc.Component,

    properties: {
        uiGraph: cc.Graphics,
        posLabel: cc.Label,
        uiNode: cc.Node,
        qzCheck: cc.Toggle,
        fillCheck: cc.Toggle,
        btnddd: cc.Node,
        move: cc.Prefab,
        moveCtr: cc.Prefab,
        line: cc.Prefab,
        lineCtr: cc.Prefab,
        quadratic: cc.Prefab,
        quadraticCtr: cc.Prefab,
        bezier: cc.Prefab,
        bezierCtr: cc.Prefab,
        close: cc.Prefab,
        closeCtr: cc.Prefab,
        arc: cc.Prefab,
        arcCtr: cc.Prefab,
        ctrContainer: cc.Node,
        optPanel: require('optpanel'),
        feiji: cc.Node,
        resultPop: cc.Node,
        resultEdit: cc.EditBox
    },

    onLoad() {
        this.gid = 0    // id计数
        this.graphNodes = []    // 所有曲线节点
        this.width = 2000       // 画布宽
        this.height = 2000      // 画布高
        this.baseScale = 20     // 基础缩放倍数
        this.lineWidth = 0.1    // 曲线宽
        this.handleWidth = 0.3  // 控制点和端点宽
        this.ctrlColor = cc.Color.GRAY  // 控制点颜色
        this.pointColor = cc.Color.WHITE    // 端点颜色
        this.mouseEnterColor = cc.Color.RED     // 鼠标悬浮时曲线颜色
        this.mouseSelColor = cc.color().fromHEX('#00aeff')  // 曲线选中颜色
        this.mouseEnterNode = null  // 鼠标当前悬浮曲线节点
        this.mouseSelNode = null    // 当前选中节点
        this.creatingNode = null    // 正在创建的节点
        this.uiGraph.node.scale = this.baseScale
        this.feiji.scale = 0.05

        this.optPanel.init(this)

        this.initEvent()

        //*
        let node = this.genGNode(null,'move',true)
        node.init(this,cc.v2(-6,3),cc.v2(-6,3))
        this.genCtr('move',node,0)
        node = this.genGNode(null,'quadratic',true)
        node.init(this,cc.v2(-6,3),cc.v2(-10,13),cc.v2(-4,14))
        this.genCtr('quadratic',node,1)
        node = this.genGNode(null,'line',true)
        node.init(this,cc.v2(-4,14),cc.v2(7,16))
        this.genCtr('line',node,2)
        node = this.genGNode(null,'bezier',true)
        node.init(this,cc.v2(7,16),cc.v2(23,16),cc.v2(27,14),cc.v2(24,9))
        this.genCtr('bezier',node,3)
        // node = this.genGNode(null,'close',true)
        // node.init(this,cc.v2(24,9),cc.v2(-6,3))
        // this.genCtr('close',node,4)
        // node = this.genGNode(null,'move',true)
        // node.init(this,cc.v2(-3,-6),cc.v2(-3,-6))
        // this.genCtr('move',node,5)
        // node = this.genGNode(null,'bezier',true)
        // node.init(this,cc.v2(-3,-6),cc.v2(8,6),cc.v2(30,14),cc.v2(27,-10))
        // this.genCtr('bezier',node,6)
        // node = this.genGNode(null,'arc',true)
        // node.init(this,cc.v2(27,-10),cc.v2(32,-5))
        // this.genCtr('arc',node,7)
        //*/

        /*
        let sp = cc.v2(0,0)
        let ep = cc.v2(10,10)
        let diff = ep.sub(sp)
        let cp = sp.add(diff.div(2))
        let ssp = sp.sub(cp)
        let eep = ep.sub(cp)
        let a1 = eep.signAngle(cc.v2(5,0))
        let a2 = ssp.signAngle(cc.v2(5,0))
        this.drawHelpUI()
        this.uiGraph.moveTo(sp.x,sp.y)
        this.uiGraph.lineTo(ep.x,ep.y)
        this.uiGraph.arc(cp.x,cp.x,diff.mag()/2.0,-a2,-a1)
        this.uiGraph.stroke()
        //*/
    },

    update (dt) {
        this.drawHelpUI()
        this.drawGraph()
    },

    drawHelpUI() {
        let graph = this.uiGraph
        graph.clear()

        this.uiGraph.fillColor = cc.color().fromHEX('#1e1e1e')
        const { width, height, baseScale } = this
        graph.rect(-width/2.0, -height/2.0, width, height)
        graph.fill()
        graph.lineWidth = 0.09
        graph.strokeColor = cc.color().fromHEX('#353536')

        // 竖线
        for (let i = -height/2; i < height/2; i++) {
            if (i != 0) {
                graph.moveTo(-width/2,i)
                graph.lineTo(width/2,i)
                graph.stroke()
            }
        }
        // 横线
        for (let i = -width/2; i < width/2; i++) {
            if (i != 0) {
                graph.moveTo(i,-height/2)
                graph.lineTo(i,height/2)
                graph.stroke()
            }
        }
        graph.stroke()
        // x轴
        graph.lineWidth = 0.2 * baseScale / graph.node.scale
        graph.strokeColor = cc.Color.RED
        graph.moveTo(-width/2,0)
        graph.lineTo(width/2,0)
        graph.stroke()
        // y轴
        graph.lineWidth = 0.2 * baseScale / graph.node.scale
        graph.strokeColor = cc.Color.GREEN
        graph.moveTo(0,-height/2)
        graph.lineTo(0,height/2)
        graph.stroke()
    },

    drawGraph() {
        let graph = this.uiGraph
        graph.fillColor = cc.color(255,255,255,64)
        graph.lineWidth = this.lineWidth * this.baseScale / graph.node.scale

        graph.strokeColor = this.pointColor
        for (let i = 0, len = this.graphNodes.length; i < len; i++) {
            let gcom = this.graphNodes[i]            
            gcom.draw()
        }
        if (this.fillCheck.isChecked) {
            graph.fill()
        }
        graph.stroke()

        for (let i = 0, len = this.graphNodes.length; i < len; i++) {
            let gcom = this.graphNodes[i]
            gcom.drawHelp()
        }
    },

    initEvent() {
        let uiNode = this.uiGraph.node
        this.node.on(cc.Node.EventType.MOUSE_WHEEL,function (e) {
            let ss = e.getScrollY() / 120
            let oScale = ss > 0 ? uiNode.scale * 1.2 * ss :  - uiNode.scale * 0.8 * ss
            let scale = Math.max(1,Math.min(40,oScale))
            uiNode.scale = scale
            this.feiji.scale = 0.05 * this.baseScale / scale
            this.updateAddBtnPos()
        },this)

        this.node.on(cc.Node.EventType.TOUCH_START,function (e) {
            this.setMouseEnterNode(null)
            this.setMouseSelNode(null)
            if (this.creatingNode) {
                this.setCreatingNode(null)
            }
        },this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE,function (e) {
            uiNode.position = uiNode.position.add(e.getDelta())
        },this)

        this.node.on(cc.Node.EventType.MOUSE_ENTER,function (e) {
            this.posLabel.node.active = true
        },this)
        this.node.on(cc.Node.EventType.MOUSE_MOVE,function (e) {
            let wPos = e.getLocation()
            let lPos = this.node.convertToNodeSpaceAR(wPos)
            this.posLabel.node.position = lPos.add(cc.v2(10,-10))
            if (this.qzCheck.isChecked) {
                lPos = uiNode.convertToNodeSpaceAR(wPos)
                let oPos = cc.v3()
                cc.Vec3.round(oPos,lPos)
                this.posLabel.string = '('+oPos.x+','+oPos.y+')'
            } else {
                let { x, y } = uiNode.convertToNodeSpaceAR(wPos)
                this.posLabel.string = '('+x.toFixed(2)+','+y.toFixed(2)+')'
            }
            if (this.creatingNode) {
                this.creatingNode.updateEP(e)
                this.creatingNode.updateNextSP()
            }
        },this)
        /*
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function (e) {
            this.posLabel.node.active = false
        },this)
        this.uiNode.on(cc.Node.EventType.MOUSE_MOVE,function (e) {
            e.stopPropagation()
        },this)
        /*/

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,function (e) {
            switch (e.keyCode) {
                case cc.macro.KEY.escape:
                    if (this.creatingNode) {
                        this.deleteGNodeByGid(this.creatingNode.gid)
                    }
                    break;
                case cc.macro.KEY.Delete:
                    if (this.creatingNode) {
                        this.deleteGNodeByGid(this.creatingNode.gid)
                    } else if (this.mouseSelNode) {
                        this.deleteGNodeByGid(this.mouseSelNode.gid)
                    }
                    break;
            }
        },this)
    },

    setCreatingNode(node) {
        this.creatingNode = node
    },

    setMouseEnterNode(node) {
        this.mouseEnterNode = node
    },

    setMouseSelNode(node) {
        this.mouseSelNode = node
        if (node) {
            this.btnddd.active = true
            this.updateAddBtnPos()
        } else {
            this.btnddd.active = false
        }
        this.optPanel.hide()
    },

    updateAddBtnPos() {
        if (!this.mouseSelNode) {
            return
        }
        let ep = this.node.convertToNodeSpaceAR(this.mouseSelNode.node.convertToWorldSpaceAR(this.mouseSelNode.ep))
        this.btnddd.position = ep.add(cc.v2(20,-20))
    },

    onAddBtnClick(e,tag) {
        if (this.optPanel.node.active == true) {
            this.optPanel.hide()
        } else {
            let node = e.target
            let wpos = node.parent.convertToWorldSpaceAR(node.position)
            let lpos = this.node.convertToNodeSpaceAR(wpos)
            this.optPanel.node.position = lpos
            this.optPanel.show()
        }
    },

    closeResultPop() {
        this.resultPop.active = false
    },

    deleteGNodeByGid(gid) {
        let i = 0, len = this.graphNodes.length
        for (; i < len; i++) {
            let curSeg = this.graphNodes[i]
            if (curSeg.gid == gid) {
                let preSeg = len == 0 ? null : this.graphNodes[i-1]
                let nextSeg = len > i + 1 ? this.graphNodes[i+1] : null
                if (curSeg.name.indexOf('move') != -1) {
                    if (nextSeg) {
                        if (!preSeg && nextSeg.name.indexOf('move') == -1) {
                            return alert('无法删除曲线起始点')
                        }
                        if (preSeg && preSeg.name.indexOf('close') != -1) {
                            return alert('无法删除曲线起始点')
                        }
                    }
                }
                if (this.creatingNode && this.creatingNode.gid == curSeg.gid) {
                    this.setCreatingNode(null)
                }
                if (this.mouseSelNode && this.mouseSelNode.gid == curSeg.gid) {
                    this.setMouseSelNode(null)
                }
                if (nextSeg) {
                    nextSeg.sp = curSeg.sp
                    // 如果只剩下move和close,需要把close也删除
                    if (preSeg && preSeg.name.indexOf('move') != -1 && nextSeg.name.indexOf('close') != -1) {
                        this.graphNodes.splice(i+1,1)
                        nextSeg.ctr.node.destroy()
                        nextSeg.node.destroy()
                    }
                }
                this.graphNodes.splice(i,1)
                curSeg.ctr.node.destroy()
                curSeg.node.destroy()
                break
            }
        }
    },

    genGNode(e,type,bySelf) {
        this.gid ++
        let node = cc.instantiate(this[type])
        let gcom = node.getComponent('graphbase')
        let graphNodes = this.graphNodes, index = graphNodes.length
        if (this.mouseSelNode) {
            for (let i = 0; i < index; i++) {
                if (graphNodes[i].gid == this.mouseSelNode.gid) {
                    index = i
                    break
                }
            }
        } else {
            index --
        }
        let sPos = index >= 0 ? graphNodes[index].ep : cc.v2(0,0)
        if (!!!bySelf) {
            switch (type) {
                case 'move':
                case 'close':
                case 'line':
                    gcom.init(this,sPos,sPos)
                    break;
                case 'arc':
                    gcom.init(this,sPos,sPos.add(cc.v2(5,5)))
                    break;
                case 'quadratic':
                    gcom.init(this,sPos,sPos,sPos)
                    break;
                case 'bezier':
                    gcom.init(this,sPos,sPos,sPos,sPos)
                    break;
            }
            if (type == 'close') {
                let moveSeg = null
                for (let i = index; i >= 0; i--) {
                    let segCom = graphNodes[i]            
                    if (segCom.name.indexOf('move') != -1) {
                        moveSeg = segCom
                        break
                    }
                }
                gcom.ep = moveSeg.ep
            } else {
                this.setCreatingNode(gcom)
            }
            this.genCtr(type,gcom,index+1)
        }
        node.parent = this.uiGraph.node
        graphNodes.splice(index+1,0,gcom)
        this.setMouseSelNode(null)
        return gcom
    },

    genCtr(type,gcom,index) {
        let ctrNode = cc.instantiate(this[type+'Ctr'])
        // ctrNode.parent = this.ctrContainer
        this.ctrContainer.insertChild(ctrNode,index)
        let ctr = ctrNode.getComponent('ctrbase')
        gcom.setCtr(ctr)
        return ctr
    },

    genPath() {
        let path = []
        for (let i = 0, len = this.graphNodes.length; i < len; i++) {
            let gcom = this.graphNodes[i]            
            path.push(gcom.genPath())
        }
        this.resultPop.active = true
        this.resultEdit.string = path.join(' ')
    },
    showAction() {
        this.feiji.active = true
        this.feiji.stopAllActions()
        let action = cc.tween()
        action.show()
        for (let i = 0, len = this.graphNodes.length; i < len; i++) {
            let gcom = this.graphNodes[i]          
            gcom.showAction(action)
        }
        action.delay(1)
        action.hide()
        action.target(this.feiji).start()
    },
    getAction() {
        let actions = [], actionsStr = ''
        for (let i = 0, len = this.graphNodes.length; i < len; i++) {
            let gcom = this.graphNodes[i]
            actions.push(gcom.getAction())        
        }
        actionsStr = actions.join('\n')
        let out =  `
        function startCurveAction(target) {
            function bezier2(s,c,e,t) {
                var t1 = 1 - t
                return t1 * t1 * s + 2 * t * t1 * c + t * t * e
            }
            function bezier3(s,c1,c2,e,t) {
                var t1 = 1 - t;
                return t1 * (t1 * (s + (c1 * 3 - s) * t) + c2 * 3 * t * t) + e * t * t * t;
            }
            function direction(x1,y1,x2,y2) {
                let dir = cc.v2(x2 - x1,y2 - y1)
                let angle = dir.signAngle(cc.v2(1,0))
                return - angle / Math.PI * 180
            }
            let action = cc.tween()
            ${actionsStr}
            action.target(target).start()
        }
        `
        this.resultPop.active = true
        this.resultEdit.string = out
    }
});
