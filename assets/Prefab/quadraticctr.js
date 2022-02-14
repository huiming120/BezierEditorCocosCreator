cc.Class({
    extends: require('ctrbase'),

    properties: {
        cpx: require('posinput'),
        cpy: require('posinput')
    },

    init(gcom) {
        this._super(gcom)
        this.cpx.init(gcom.cp.x,this.onValueChange.bind(this))
        this.cpy.init(gcom.cp.y,this.onValueChange.bind(this))
    },

    updateGNode() {
        this.gcom.cp = this.getPos(this.cpx.editBox.string,this.cpy.editBox.string,this.gcom.cp)
        this._super()
    }
});
