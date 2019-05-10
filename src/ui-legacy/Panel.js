import $ from "jquery";

export default class UIPanel {
    constructor(panelDom, isCollapsed) {
        this.jqDom = $(panelDom);
        this.name = this.jqDom.data('panelName');
        this.jqCollapseButton = this.jqDom.find(".collapseButton[data-panel-name='" + this.name + "']");
        this.jqCollapseButton.click(() => this.toggleCollapse());
        this.isCollapsed = !!isCollapsed;

        if (this.isCollapsed) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    show() {
        this.jqDom.show();
    }

    hide() {
        this.jqDom.hide();
    }

    toggleCollapse() {
        this.isCollapsed ? this.expand() : this.collapse();
    }

    collapse() {
        this.jqCollapseButton.html('Show');
        this.isCollapsed = true;
        this.jqDom.find(".panelContent[data-panel-name='" + this.name + "']").hide();
    }

    expand() {
        this.jqCollapseButton.html('Hide');
        this.isCollapsed = false;
        this.jqDom.find(".panelContent[data-panel-name='" + this.name + "']").show();
    }
}
