cc.Class({
    extends: require('graphbase'),
    updateNextSP() {
        this._super()
        // 需要更新close的ep
        let findMe = false
        for (let i = 0, len = this.edit.graphNodes.length; i < len; i++) {
            let gcom = this.edit.graphNodes[i]
            if (gcom.gid == this.gid) {
                findMe = true
                continue
            }
            if (findMe) {
                if (gcom.name.indexOf('move') != -1) {
                    break
                }
                if (gcom.name.indexOf('close') != -1) {
                    gcom.ep = this.ep
                    break
                }
            }
        }
    },
    draw() {
        let graph = this.edit.uiGraph
        graph.moveTo(this.ep.x,this.ep.y)
    },

    genPath() {
        return ['M',this.ep.x,this.ep.y].join(' ')
    },
    showAction(tweenAction) {
        tweenAction.set({ position: cc.v2(this.ep.x,this.ep.y) })
    },
    getAction() {
        return `action.set({ position: cc.v2(${this.ep.x},${this.ep.y}) });`
    }
});
