cc.Class({
    extends: cc.Component,

    properties: {
        pointType: 'pointer',
        mouseEnterHandler: cc.Component.EventHandler,
        mouseLeaveHandler: cc.Component.EventHandler
    },

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,function (e) {
            cc.game.canvas.style.cursor = this.pointType
            if (this.mouseEnterHandler && this.mouseEnterHandler.target) {
                this.mouseEnterHandler.emit([e])
            }
        },this)
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function (e) {
            cc.game.canvas.style.cursor = "auto"
            if (this.mouseLeaveHandler && this.mouseLeaveHandler.target) {
                this.mouseLeaveHandler.emit([e])
            }
        },this)
    },
});
