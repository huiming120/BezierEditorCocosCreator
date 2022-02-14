cc.Class({
    extends: require('ctrbase'),

    properties: {
        cp1x: require('posinput'),
        cp1y: require('posinput'),
        cp2x: require('posinput'),
        cp2y: require('posinput')
    },

    init(gcom) {
        this._super(gcom)
        this.cp1x.init(gcom.cp1.x,this.onValueChange.bind(this))
        this.cp1y.init(gcom.cp1.y,this.onValueChange.bind(this))
        this.cp2x.init(gcom.cp2.x,this.onValueChange.bind(this))
        this.cp2y.init(gcom.cp2.y,this.onValueChange.bind(this))
    },

    updateGNode() {
        this.gcom.cp1 = this.getPos(this.cp1x.editBox.string,this.cp1y.editBox.string,this.gcom.cp1)
        this.gcom.cp2 = this.getPos(this.cp2x.editBox.string,this.cp2y.editBox.string,this.gcom.cp2)
        this._super()
    }
});
