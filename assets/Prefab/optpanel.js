cc.Class({
    extends: cc.Component,

    properties: {
        dyBtns: [cc.Button]
    },

    init(edit) {
        this.edit = edit
    },

    show() {
        let edit = this.edit, graphNodes = edit.graphNodes, len = graphNodes.length
        for (const btn of this.dyBtns) {
            btn.interactable = len > 0
        }
        if (edit.mouseSelNode) {
            if (edit.mouseSelNode.name.indexOf('close') != -1) {
                this.dyBtns[0].interactable = false
                this.dyBtns[1].interactable = false
                this.dyBtns[2].interactable = false
                this.dyBtns[3].interactable = false
                this.dyBtns[4].interactable = false
            } else {
                for (let i = 0; i < len; i++) {
                    let segCom = graphNodes[i]            
                    if (segCom.gid == edit.mouseSelNode.gid) {
                        if (len > i + 1) {
                            if (graphNodes[i+1].name.indexOf('move') == -1) {
                                this.dyBtns[4].interactable = false
                            }
                        }
                        break
                    }
                }
            }
        } else {
            if (len > 0) {
                let lastCom = graphNodes[len-1]
                if (lastCom.name.indexOf('close') != -1) {
                    this.dyBtns[4].interactable = false
                }
            }
        }
        this.node.active = true
    },

    hide() {
        this.node.active = false
    },

    mouseEnter(e) {
        e.target.color = cc.color(21,85,149)
    },

    mouseLeave(e) {
        e.target.color = cc.color(8,127,246)
    },

    onDeleteBtnClick() {
        if (this.edit.mouseSelNode) {
            this.edit.deleteGNodeByGid(this.edit.mouseSelNode.gid)
        }
    }
});
