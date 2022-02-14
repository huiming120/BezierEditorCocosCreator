cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
        hoverLabel: cc.Label,
        hover: cc.Node
    },

    onLoad() {
        this.hoverLabel.string = this.node.name
    },

    init(value,callback) {
        this.editBox.string = value
        this.callback = callback
    },

    mouseEnter(e) {
        this.hover.active = true
    },

    mouseLeave(e) {
        this.hover.active = false
    },

    onEditingDidBegan() {
        if (this.callback) {
            this.callback('editing-did-began',this)
        }
    },

    onTextChanged(value,editBox) {
        value = parseFloat(value)
        if (!isNaN(value) && this.callback) {
            this.callback('text-changed',this,value)
        }
    },

    onEditingDidEnded(editBox) {
        if (this.callback) {
            this.callback('editing-did-ended',this)
        }
    }
});
