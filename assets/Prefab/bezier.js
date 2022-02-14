cc.Class({
    extends: require('graphbase'),

    properties: {
        ctrl1Node: cc.Node,
        ctrl2Node: cc.Node,
        _cp1: {
            default: cc.v2(0,0),
            serializable: false
        },
        cp1: {
            visible: false,
            get() {
                return this._cp1
            },
            set(pos) {
                this._cp1 = pos
                this.ctrl1Node.position = this._cp1
                this.ctr && this.ctr.updateFromGnode('cp1')
            }
        },
        _cp2: {
            default: cc.v2(0,0),
            serializable: false
        },
        cp2: {
            visible: false,
            get() {
                return this._cp2
            },
            set(pos) {
                this._cp2 = pos
                this.ctrl2Node.position = this._cp2
                this.ctr && this.ctr.updateFromGnode('cp2')
            }
        }
    },

    init(edit,sp,cp1,cp2,ep) {
        this._super(edit,sp,ep)
        this.cp1 = cp1
        this.cp2 = cp2

        this.ctrl1Node.on(cc.Node.EventType.MOUSE_ENTER,function (e) {
            cc.game.canvas.style.cursor = "pointer"
            this.edit.setMouseEnterNode(this)
        },this)
        this.ctrl1Node.on(cc.Node.EventType.MOUSE_LEAVE,function (e) {
            cc.game.canvas.style.cursor = "auto"
            this.edit.setMouseEnterNode(null)
        },this)
        this.ctrl1Node.on(cc.Node.EventType.TOUCH_START,function (e) {
            this.edit.setMouseSelNode(this)
            e.stopPropagation()
        },this)
        this.ctrl1Node.on(cc.Node.EventType.TOUCH_MOVE,function (e) {
            e.stopPropagation()
            if (this.edit.qzCheck.isChecked) {
                let wPos = e.getLocation()
                let lPos = this.node.convertToNodeSpaceAR(wPos)
                let oPos = cc.v3()
                cc.Vec3.round(oPos,lPos)
                this.cp1 = oPos
            } else {
                let scale = this.edit.uiGraph.node.scale
                this.cp1 = this.cp1.add(e.getDelta().scale(cc.v2(1/scale,1/scale)))
            }
        },this)
        this.ctrl2Node.on(cc.Node.EventType.MOUSE_ENTER,function (e) {
            cc.game.canvas.style.cursor = "pointer"
            this.edit.setMouseEnterNode(this)
        },this)
        this.ctrl2Node.on(cc.Node.EventType.MOUSE_LEAVE,function (e) {
            cc.game.canvas.style.cursor = "auto"
            this.edit.setMouseEnterNode(null)
        },this)
        this.ctrl2Node.on(cc.Node.EventType.TOUCH_START,function (e) {
            this.edit.setMouseSelNode(this)
            e.stopPropagation()
        },this)
        this.ctrl2Node.on(cc.Node.EventType.TOUCH_MOVE,function (e) {
            e.stopPropagation()
            if (this.edit.qzCheck.isChecked) {
                let wPos = e.getLocation()
                let lPos = this.node.convertToNodeSpaceAR(wPos)
                let oPos = cc.v3()
                cc.Vec3.round(oPos,lPos)
                this.cp2 = oPos
            } else {
                let scale = this.edit.uiGraph.node.scale
                this.cp2 = this.cp2.add(e.getDelta().scale(cc.v2(1/scale,1/scale)))
            }
        },this)
    },

    updateScale(scale) {
        this._super(scale)
        let s = this.edit.handleWidth * 20 / scale
        this.ctrl1Node.width = s
        this.ctrl1Node.height = s
        this.ctrl2Node.width = s
        this.ctrl2Node.height = s
    },

    draw() {
        let graph = this.edit.uiGraph
        graph.bezierCurveTo(this.cp1.x,this.cp1.y,this.cp2.x,this.cp2.y,this.ep.x,this.ep.y)
    },

    drawHelp() {
        this._super()
        let graph = this.edit.uiGraph
        graph.strokeColor = this.edit.ctrlColor
        graph.moveTo(this.sp.x,this.sp.y)
        graph.lineTo(this.cp1.x,this.cp1.y)
        graph.moveTo(this.ep.x,this.ep.y)
        graph.lineTo(this.cp2.x,this.cp2.y)
        graph.stroke()
    },
    mouseSel() {
        this._super()
        this.ctrl1Node.color = this.edit.mouseSelColor
        this.ctrl2Node.color = this.edit.mouseSelColor
        let graph = this.edit.uiGraph
        graph.strokeColor = this.edit.mouseSelColor
        graph.moveTo(this.sp.x,this.sp.y)
        graph.bezierCurveTo(this.cp1.x,this.cp1.y,this.cp2.x,this.cp2.y,this.ep.x,this.ep.y)
        graph.stroke()
    },
    mouseEnter() {
        this._super()
        this.ctrl1Node.color = this.edit.mouseEnterColor
        this.ctrl2Node.color = this.edit.mouseEnterColor
        let graph = this.edit.uiGraph
        graph.strokeColor = this.edit.mouseEnterColor
        graph.moveTo(this.sp.x,this.sp.y)
        graph.bezierCurveTo(this.cp1.x,this.cp1.y,this.cp2.x,this.cp2.y,this.ep.x,this.ep.y)
        graph.stroke()
    },
    mouseNone() {
        this._super()
        this.ctrl1Node.color = this.edit.ctrlColor
        this.ctrl2Node.color = this.edit.ctrlColor
    },
    bezier(s,c1,c2,e,t) {
        var t1 = 1 - t;
        return t1 * (t1 * (s + (c1 * 3 - s) * t) + c2 * 3 * t * t) + e * t * t * t;
    },
    genPath() {
        return ['C',this.cp1.x,this.cp1.y,this.cp2.x,this.cp2.y,this.ep.x,this.ep.y].join(' ')
    },
    showAction(tweenAction) {
        // tweenAction.bezierTo(1,this.cp1,this.cp2,this.ep)
        var self = this
        var prex = this.sp.x, prey = this.sp.y, x, y
        tweenAction.to(1,{ 
            position: {
                value: this.ep,
                progress: (start, end, current, ratio) => {
                    current.x = self.bezier(start.x,self.cp1.x,self.cp2.x,end.x,ratio)
                    current.y = self.bezier(start.y,self.cp1.y,self.cp2.y,end.y,ratio)
                    x = current.x
                    y = current.y
                    return current
                }
            },
            angle: {
                value: 180,
                progress: (start, end, current, ratio) => {
                    let angle = this.direction(prex,prey,x,y)
                    prex = x
                    prey = y
                    return angle
                }
            },
        })
    },
    getAction() {
        return `
        (function () {
            let prex = ${this.sp.x}, prey = ${this.sp.y}, x, y
            action.to(1,{ 
                position: {
                    value: cc.v2(${this.ep.x},${this.ep.y}),
                    progress: (start, end, current, ratio) => {
                        current.x = bezier3(start.x,${this.cp1.x},${this.cp2.x},end.x,ratio)
                        current.y = bezier3(start.y,${this.cp1.y},${this.cp2.y},end.y,ratio)
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
                },
            })
        })();
        `
    }
});
