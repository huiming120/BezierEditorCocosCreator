cc.Class({
    extends: require('graphbase'),
    updateNextSP() {},
    draw() {
        let graph = this.edit.uiGraph
        graph.close()
    },
    mouseSel() {
        this._super()
        let graph = this.edit.uiGraph
        graph.strokeColor = this.edit.mouseSelColor
        graph.moveTo(this.sp.x,this.sp.y)
        graph.lineTo(this.ep.x,this.ep.y)
        graph.stroke()
    },
    mouseEnter() {
        this._super()
        let graph = this.edit.uiGraph
        graph.strokeColor = this.edit.mouseEnterColor
        graph.moveTo(this.sp.x,this.sp.y)
        graph.lineTo(this.ep.x,this.ep.y)
        graph.stroke()
    },
    genPath() {
        return 'Z'
    },
    showAction(tweenAction) {
        let angle = this.direction(this.sp.x,this.sp.y,this.ep.x,this.ep.y)
        tweenAction.parallel(
            cc.tween().set({ angle }),
            cc.tween().to(1, { position: cc.v2(this.ep.x,this.ep.y) })
        )
    },
    getAction() {
        let angle = this.direction(this.sp.x,this.sp.y,this.ep.x,this.ep.y)
        return `action.parallel(
            cc.tween().set({ angle: ${angle} }),
            cc.tween().to(1, { position: cc.v2(${this.ep.x},${this.ep.y}) })
        );`
    }
});
