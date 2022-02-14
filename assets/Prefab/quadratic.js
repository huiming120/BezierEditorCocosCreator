cc.Class({
    extends: require('graphbase'),

    properties: {
        ctrlNode: cc.Node,
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
                this.ctrlNode.position = this._cp
                this.ctr && this.ctr.updateFromGnode('cp')
            }
        }
    },

    init(edit,sp,cp,ep) {
        this._super(edit,sp,ep)
        this.cp = cp

        this.ctrlNode.on(cc.Node.EventType.MOUSE_ENTER,function (e) {
            cc.game.canvas.style.cursor = "pointer"
            this.edit.setMouseEnterNode(this)
        },this)
        this.ctrlNode.on(cc.Node.EventType.MOUSE_LEAVE,function (e) {
            cc.game.canvas.style.cursor = "auto"
            this.edit.setMouseEnterNode(null)
        },this)
        this.ctrlNode.on(cc.Node.EventType.TOUCH_START,function (e) {
            this.edit.setMouseSelNode(this)
            e.stopPropagation()
        },this)
        this.ctrlNode.on(cc.Node.EventType.TOUCH_MOVE,function (e) {
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
        },this)
    },

    updateScale(scale) {
        this._super(scale)
        let s = this.edit.handleWidth * 20 / scale
        this.ctrlNode.width = s
        this.ctrlNode.height = s
    },

    draw() {
        let graph = this.edit.uiGraph
        graph.quadraticCurveTo(this.cp.x,this.cp.y,this.ep.x,this.ep.y)
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
        this.ctrlNode.color = this.edit.mouseSelColor
        let graph = this.edit.uiGraph
        graph.strokeColor = this.edit.mouseSelColor
        graph.moveTo(this.sp.x,this.sp.y)
        graph.quadraticCurveTo(this.cp.x,this.cp.y,this.ep.x,this.ep.y)
        graph.stroke()
    },
    mouseEnter() {
        this._super()
        this.ctrlNode.color = this.edit.mouseEnterColor
        let graph = this.edit.uiGraph
        graph.strokeColor = this.edit.mouseEnterColor
        graph.moveTo(this.sp.x,this.sp.y)
        graph.quadraticCurveTo(this.cp.x,this.cp.y,this.ep.x,this.ep.y)
        graph.stroke()
    },
    mouseNone() {
        this._super()
        this.ctrlNode.color = this.edit.ctrlColor
    },
    bezier(s,c,e,t) {
        var t1 = 1 - t
        return t1 * t1 * s + 2 * t * t1 * c + t * t * e
    },
    genPath() {
        return ['Q',this.cp.x,this.cp.y,this.ep.x,this.ep.y].join(' ')
    },
    showAction(tweenAction) {
        var self = this
        var prex = this.sp.x, prey = this.sp.y, x, y
        tweenAction.to(1,{ 
            position: {
                value: this.ep,
                progress: (start, end, current, ratio) => {
                    current.x = self.bezier(start.x,self.cp.x,end.x,ratio)
                    current.y = self.bezier(start.y,self.cp.y,end.y,ratio)
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
                        current.x = bezier2(start.x,${this.cp.x},end.x,ratio)
                        current.y = bezier2(start.y,${this.cp.y},end.y,ratio)
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
