import { MenuItem } from "./menu-items/menu-item";
import { DropDownMenuItem } from "./menu-items/drop-down-menu-item";
import { TOP_MENU_ITEMS } from "./constants";
import { HELP_PAGE_URL } from "../../constants";
import { LinkMenuItem } from "./menu-items/link-menu-item";
import { showWizard, wizardIds } from "../../components/tutorials";
import { openLinkInNewTab } from "../../utils";

export class HeaderStore {
    /**
     * @param {AppModel} appModel
     */
    constructor(appModel) {
        this._appModel = appModel;
    }

    /**
     * @return {MenuItem[]}
     */
    get mainMenu() {
        return [
            new DropDownMenuItem(TOP_MENU_ITEMS.SIMULATION, [
                {
                    label: "Orbit creation panel",
                    selected: this._appModel.visualObjects.creationPanel.isVisible,
                    onUpdate: ({ selected }) => {
                        this._appModel.visualObjects.creationPanel.toggle(selected);
                    },
                },
                {
                    label: "Transfer calculation panel",
                    selected: this._appModel.visualObjects.transferCalculationPanel.isVisible,
                    onUpdate: ({ selected }) => {
                        this._appModel.visualObjects.transferCalculationPanel.toggle(selected);
                    },
                },
            ]),
            new LinkMenuItem(TOP_MENU_ITEMS.EDIT),
            new DropDownMenuItem(TOP_MENU_ITEMS.VIEW, [
                {
                    label: "Body Labels",
                    selected: this._appModel.visualObjects.bodyLabels.isVisible,
                    onUpdate: ({ selected }) => {
                        this._appModel.visualObjects.bodyLabels.toggle(selected);
                    },
                },
                {
                    label: "Statistics badge",
                    selected: this._appModel.visualObjects.statisticsBadge.isVisible,
                    onUpdate: ({ selected }) => {
                        this._appModel.visualObjects.statisticsBadge.toggle(selected);
                    },
                },
                {
                    label: "Satellite search panel",
                    selected: this._appModel.visualObjects.satelliteSearchPanel.isVisible,
                    onUpdate: ({ selected }) => {
                        this._appModel.visualObjects.satelliteSearchPanel.toggle(selected);
                    },
                },
            ]),
            new DropDownMenuItem(TOP_MENU_ITEMS.HELP, [
                new MenuItem({
                    label: "Urbain Wiki",
                    onClick: () => {
                        openLinkInNewTab(HELP_PAGE_URL);
                    },
                }),
                new MenuItem({
                    label: "Show tutorial",
                    onClick: () => {
                        showWizard({ wizardId: wizardIds.GETTING_STARTED_WIZARD, ignoreWatchStatusCheck: true });
                    },
                }),
            ]),
        ];
    }
}
