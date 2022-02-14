cc.Class({
    extends: require('graphbase'),

    properties: {
        centerNode: cc.Node,
        sp: {
            visible: false,
            override: true,
            get() {
                return this._sp
            },
            set(pos) {
                this._sp = pos
                this.fixEP()
            }
        },
        _cp: {
            default: cc.v2(0,0),
            serializable: false
        },
        cp: {
            visible: false,
            get() {
                return this._cp
            },
            set(pos) {
                this._cp = pos
                this.centerNode.position = this._cp
                this.ctr && this.ctr.updateFromGnode('cp')
                this.fixEP()
            }
        }
    },

    init(edit,sp,ep,counterclockwise) {
        let diff = ep.sub(sp)
        this.cp = sp.add(diff.div(2))
        this._super(edit,sp,ep)
        this.counterclockwise = !!counterclockwise

        this.centerNode.on(cc.Node.EventType.MOUSE_ENTER,function (e) {
            cc.game.canvas.style.cursor = "pointer"
            this.edit.setMouseEnterNode(this)
        },this)
        this.centerNode.on(cc.Node.EventType.MOUSE_LEAVE,function (e) {
            cc.game.canvas.style.cursor = "auto"
            this.edit.setMouseEnterNode(null)
        },this)
        this.centerNode.on(cc.Node.EventType.TOUCH_START,function (e) {
            this.edit.setMouseSelNode(this)
            e.stopPropagation()
        },this)
        this.centerNode.on(cc.Node.EventType.TOUCH_MOVE,function (e) {
            e.stopPropagation()
            if (this.edit.qzCheck.isChecked) {
                let wPos = e.getLocation()
                let lPos = this.node.convertToNodeSpaceAR(wPos)
                let oPos = cc.v3()
                cc.Vec3.round(oPos,lPos)
                this.cp = oPos
            } else {
                let scale = this.edit.uiGraph.node.scale
                this.cp = this.cp.add(e.getDelta().scale(cc.v2(1/scale,1/scale)))
            }
            this.edit.updateAddBtnPos()
        },this)
    },
    updateEP(e) {
        this._super(e)
        this.fixEP()
    },
    fixEP() {
        // 限制只能在圆周上动
        let r = this.cp.sub(this.sp).mag()
        // 1.减去中心点 2.归一 3.放大半径倍数 4.加上中心点 即为圆周上的点
        this.ep = this.ep.sub(this.cp).normalize().mul(r).add(this.cp)
    },
    updateScale(scale) {
        this._super(scale)
        let s = this.edit.handleWidth * 20 / scale
        this.centerNode.width = s
        this.centerNode.height = s
    },
    draw() {
        let graph = this.edit.uiGraph
        let sp = cc.v2(this.sp.x,this.sp.y), ep = cc.v2(this.ep.x,this.ep.y), cp = this.cp
        let r = cp.sub(sp)
        let ssp = sp.sub(cp)
        let eep = ep.sub(cp)
        let a1 = eep.signAngle(cc.v2(5,0))
        let a2 = ssp.signAngle(cc.v2(5,0))
        graph.arc(cp.x,cp.y,r.mag(),-a2,-a1,this.counterclockwise)
    },
    drawHelp() {
        this._super()
        let graph = this.edit.uiGraph
        graph.strokeColor = this.edit.ctrlColor
        graph.moveTo(this.sp.x,this.sp.y)
        graph.lineTo(this.cp.x,this.cp.y)
        graph.lineTo(this.ep.x,this.ep.y)
        graph.stroke()
    },
    mouseSel() {
        this._super()
        this.centerNode.color = this.edit.mouseSelColor
        let graph = this.edit.uiGraph
        graph.strokeColor = this.edit.mouseSelColor
        let sp = cc.v2(this.sp.x,this.sp.y), ep = cc.v2(this.ep.x,this.ep.y), cp = this.cp
        let r = cp.sub(sp)
        let ssp = sp.sub(cp)
        let eep = ep.sub(cp)
        let a1 = eep.signAngle(cc.v2(5,0))
        let a2 = ssp.signAngle(cc.v2(5,0))
        graph.arc(cp.x,cp.y,r.mag(),-a2,-a1,this.counterclockwise)
        graph.stroke()
    },
    mouseEnter() {
        this._super()
        this.centerNode.color = this.edit.mouseEnterColor
        let graph = this.edit.uiGraph
        graph.strokeColor = this.edit.mouseEnterColor
        let sp = cc.v2(this.sp.x,this.sp.y), ep = cc.v2(this.ep.x,this.ep.y), cp = this.cp
        let r = cp.sub(sp)
        let ssp = sp.sub(cp)
        let eep = ep.sub(cp)
        let a1 = eep.signAngle(cc.v2(5,0))
        let a2 = ssp.signAngle(cc.v2(5,0))
        graph.arc(cp.x,cp.y,r.mag(),-a2,-a1,this.counterclockwise)
        graph.stroke()
    },
    mouseNone() {
        this._super()
        this.centerNode.color = this.edit.ctrlColor
    },
    genPath() {
        let { x, y } = this.cp
        let sp = cc.v2(this.sp.x,this.sp.y), ep = cc.v2(this.ep.x,this.ep.y), cp = this.cp
        let radius = cp.sub(sp).mag()
        let ssp = sp.sub(cp)
        let eep = ep.sub(cp)
        let startAngle = -ssp.signAngle(cc.v2(5,0))
        let endAngle = -eep.signAngle(cc.v2(5,0))
        let counterClockwise = !this.counterclockwise
        if (startAngle === endAngle) {
            return ''
        }
        startAngle = startAngle % (2*Math.PI);
        endAngle = endAngle % (2*Math.PI);
        if (startAngle === endAngle) {
            //circle time! subtract some of the angle so svg is happy (svg elliptical arc can't draw a full circle)
            endAngle = ((endAngle + (2*Math.PI)) - 0.001 * (counterClockwise ? -1 : 1)) % (2*Math.PI);
        }
        var endX = x+radius*Math.cos(endAngle),
            endY = y+radius*Math.sin(endAngle),
            startX = x+radius*Math.cos(startAngle),
            startY = y+radius*Math.sin(startAngle),
            sweepFlag = counterClockwise ? 0 : 1,
            largeArcFlag = 0,
            diff = endAngle - startAngle;

        // https://github.com/gliffy/canvas2svg/issues/4
        if (diff < 0) {
            diff += 2*Math.PI;
        }

        if (counterClockwise) {
            largeArcFlag = diff > Math.PI ? 0 : 1;
        } else {
            largeArcFlag = diff > Math.PI ? 1 : 0;
        }
        return ['A',radius,radius,0,largeArcFlag,sweepFlag,endX,endY].join(' ')
    },
    showAction(tweenAction) {
        let sp = cc.v2(this.sp.x,this.sp.y), ep = cc.v2(this.ep.x,this.ep.y), cp = this.cp
        let r = cp.sub(sp).mag()
        let ssp = sp.sub(cp)
        let eep = ep.sub(cp)
        let sAngle = -ssp.signAngle(cc.v2(5,0))
        let eAngle = -eep.signAngle(cc.v2(5,0))
        let diff = eAngle - sAngle
        if (diff > 0) {
            if (!this.counterclockwise) {
                diff -= 2*Math.PI
            }
        } else {
            if (this.counterclockwise) {
                diff += 2*Math.PI
            }
        }
        var prex = sp.x, prey = sp.y, x, y
        tweenAction.to(1,{ 
            position: {
                value: ep,
                progress: (start, end, current, ratio) => {
                    let angle = sAngle + diff * ratio
                    current.x = cp.x + r * Math.cos(angle)
                    current.y = cp.y + r * Math.sin(angle)
                    x = current.x
                    y = current.y
                    return current
                }
            },
            angle: {
                value: 0,
                progress: (start, end, current, ratio) => {
                    let angle = this.direction(prex,prey,x,y)
                    prex = x
                    prey = y
                    return angle
                }
            }
        })
    },
    getAction() {
        let sp = cc.v2(this.sp.x,this.sp.y), ep = cc.v2(this.ep.x,this.ep.y), cp = this.cp
        let r = cp.sub(sp).mag()
        let ssp = sp.sub(cp)
        let eep = ep.sub(cp)
        let sAngle = -ssp.signAngle(cc.v2(5,0))
        let eAngle = -eep.signAngle(cc.v2(5,0))
        let diff = eAngle - sAngle
        if (diff > 0) {
            if (!this.counterclockwise) {
                diff -= 2*Math.PI
            }
        } else {
            if (this.counterclockwise) {
                diff += 2*Math.PI
            }
        }
        return `
        (function () {
            let prex = ${sp.x}, prey = ${sp.y}, x, y
            action.to(1,{ 
                position: {
                    value: cc.v2(${ep.x},${ep.y}),
                    progress: (start, end, current, ratio) => {
                        let angle = ${sAngle} + ${diff} * ratio
                        current.x = ${cp.x} + ${r} * Math.cos(angle)
                        current.y = ${cp.y} + ${r} * Math.sin(angle)
                        x = current.x
                        y = current.y
                        return current
                    }
                },
                angle: {
                    value: 0,
                    progress: (start, end, current, ratio) => {
                        let angle = direction(prex,prey,x,y)
                        prex = x
                        prey = y
                        return angle
                    }
                }
            })
        })();
        `
    }
});
