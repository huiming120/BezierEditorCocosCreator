cc.Class({
    extends: cc.Component,

    properties: {
        epx: require('posinput'),
        epy: require('posinput'),
        bg: cc.Node
    },

    onLoad() {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,function (e) {
            cc.game.canvas.style.cursor = "pointer"
            this.gcom && this.gcom.onCtrMouseEnter()
        },this,true)
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function (e) {
            cc.game.canvas.style.cursor = "auto"
            this.gcom && this.gcom.onCtrMouseLeave()
        },this,true)
    },

    init(gcom) {
        this.gcom = gcom
        this.epx.init(gcom.ep.x,this.onValueChange.bind(this))
        this.epy.init(gcom.ep.y,this.onValueChange.bind(this))
    },

    onValueChange(etype,input,value) {
        if (etype == 'text-changed') {
            this.updateGNode()
        } else if (etype == 'editing-did-began') {
            this.onClick()
        }
    },

    updateGNode() {
        this.gcom.setEP(this.getPos(this.epx.editBox.string,this.epy.editBox.string,this.gcom.ep))
    },

    updateFromGnode(p) {
        // this.epx.editBox.string = this.gcom.ep.x.toFixed(2)
        // this.epy.editBox.string = this.gcom.ep.y.toFixed(2)
        this[p+'x'].editBox.string = this.gcom[p].x.toFixed(2)
        this[p+'y'].editBox.string = this.gcom[p].y.toFixed(2)
    },

    getPos(xStr,yStr,pos) {
        let nPos = cc.v2()
        let x = parseFloat(xStr)
        if (isNaN(x)) {
            nPos.x = pos.x
        } else {
            nPos.x = x
        }
        let y = parseFloat(yStr)
        if (isNaN(x)) {
            nPos.y = pos.y
        } else {
            nPos.y = y
        }
        return nPos
    },

    onClick() {
        this.gcom && this.gcom.onCtrSelect()
    }
});
