cc.Class({
    extends: cc.Component,

    properties: {
        endNode: cc.Node,
        _sp: {
            default: cc.v2(0,0),
            serializable: false
        },
        sp: {
            visible: false,
            get() {
                return this._sp
            },
            set(pos) {
                this._sp = pos
            }
        },
        _ep: {
            default: cc.v2(0,0),
            serializable: false
        },
        ep: {
            visible: false,
            get() {
                return this._ep
            },
            set(pos) {
                this._ep = pos
                this.endNode.position = this.ep
                this.ctr && this.ctr.updateFromGnode('ep')
            }
        }
    },
    setCtr(ctr) {
        this.ctr = ctr
        ctr.init(this)
    },
    init(edit,sp,ep) {
        this.edit = edit
        this.gid = this.edit.gid
        this.sp = sp
        this.ep = ep

        let uNode = this.edit.uiGraph.node
        this.endNode.on(cc.Node.EventType.MOUSE_ENTER,function (e) {
            cc.game.canvas.style.cursor = "pointer"
            this.edit.setMouseEnterNode(this)
        },this)
        this.endNode.on(cc.Node.EventType.MOUSE_LEAVE,function (e) {
            cc.game.canvas.style.cursor = "auto"
            this.edit.setMouseEnterNode(null)
        },this)
        this.endNode.on(cc.Node.EventType.TOUCH_START,function (e) {
            this.edit.setMouseSelNode(this)
            if (!this.edit.creatingNode || this.gid != this.edit.creatingNode.gid) {
                e.stopPropagation()
            }
        },this)
        this.endNode.on(cc.Node.EventType.TOUCH_MOVE,this.onEPTouchMove,this)

        uNode.on('scale-changed',function () {
            this.updateScale(uNode.scale)
        },this)
        this.updateScale(uNode.scale)
    },
    onEPTouchMove(e) {
        e.stopPropagation()
        this.updateEP(e)
        this.updateNextSP()
        this.edit.updateAddBtnPos()
    },
    updateScale(scale) {
        let s = this.edit.handleWidth * 20 / scale
        this.endNode.width = s
        this.endNode.height = s
    },
    updateEP(e) {
        if (this.edit.qzCheck.isChecked) {
            let wPos = e.getLocation()
            let lPos = this.node.convertToNodeSpaceAR(wPos)
            let oPos = cc.v3()
            cc.Vec3.round(oPos,lPos)
            this.ep = oPos
        } else {
            let scale = this.edit.uiGraph.node.scale
            this.ep = this.ep.add(e.getDelta().scale(cc.v2(1/scale,1/scale)))
        }
    },
    updateNextSP() {
        for (let i = 0, len = this.edit.graphNodes.length; i < len; i++) {
            if (this.edit.graphNodes[i].gid == this.gid) {
                if (len > i + 1) {
                    this.edit.graphNodes[i+1].sp = this.ep
                }
                break
            }
        }
    },
    setEP(pos) {
        this.ep = pos
        this.updateNextSP()
        this.edit.updateAddBtnPos()
    },
    onCtrMouseEnter() {
        this.edit.setMouseEnterNode(this)
    },
    onCtrMouseLeave() {
        this.edit.setMouseEnterNode(null)
    },
    onCtrSelect() {
        this.edit.setMouseSelNode(this)
    },
    draw() {},
    drawHelp() {
        if (this.edit.mouseSelNode && this.edit.mouseSelNode.gid == this.gid) {
            this.mouseSel()
        } else if (this.edit.mouseEnterNode && this.edit.mouseEnterNode.gid == this.gid) {
            this.mouseEnter()
        } else {
            this.mouseNone()
        }
    },
    mouseSel() {
        this.endNode.color = this.edit.mouseSelColor
        this.ctr && (this.ctr.bg.opacity = 100)
    },
    mouseEnter() {
        this.endNode.color = this.edit.mouseEnterColor
        this.ctr && (this.ctr.bg.opacity = 100)
    },
    mouseNone() {
        this.endNode.color = this.edit.pointColor
        this.ctr && (this.ctr.bg.opacity = 0)
    },
    direction(x1,y1,x2,y2) {
        let dir = cc.v2(x2 - x1,y2 - y1)
        let angle = dir.signAngle(cc.v2(1,0))
        return - angle / Math.PI * 180
    },
    genPath() {
        return ''
    },
    showAction(tweenAction) {},
    getAction() {
        return ''
    }
});
