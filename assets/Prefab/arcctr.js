cc.Class({
    extends: require('ctrbase'),

    properties: {
        cpx: require('posinput'),
        cpy: require('posinput'),
        counterclockwise: cc.Toggle
    },

    init(gcom) {
        this._super(gcom)
        this.cpx.init(gcom.cp.x,this.onValueChange.bind(this))
        this.cpy.init(gcom.cp.y,this.onValueChange.bind(this))
        if (gcom.counterclockwise) {
            this.counterclockwise.check()
        } else {
            this.counterclockwise.uncheck()
        }
    },

    updateGNode() {
        let cpx = this.cpx.editBox.string, cpy = this.cpy.editBox.string
        this._super()
        this.gcom.cp = this.getPos(cpx,cpy,this.gcom.cp)
    },

    onToggle(toggle) {
        this.gcom.counterclockwise = toggle.isChecked
    }
});
