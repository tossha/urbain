import { MenuItem } from "./menu-items/menu-item";
import { DropDownMenuItem } from "./menu-items/drop-down-menu-item";
import { TOP_MENU_ITEMS } from "./constants";
import { HELP_PAGE_URL } from "../../constants";
import { LinkMenuItem } from "./menu-items/link-menu-item";
import { showWizard, wizardIds } from "../../tutorials";
import { openLinkInNewTab } from "../../utils";

export class HeaderStore {
    /**
     * @param {AppModel} appModel
     * @param {AppStore} appStore
     */
    constructor(appModel, appStore) {
        this._appModel = appModel;
        this._appStore = appStore;
        this._statisticsModel = this._appModel.simulationModel.statisticsModel;
    }

    /**
     * @return {MenuItem[]}
     */
    get mainMenu() {
        const menuViewOptions = [
            {
                label: "Body Labels",
                selected: this._appModel.bodyLabels.isVisible,
                onUpdate: ({ selected }) => {
                    this._appModel.bodyLabels.toggle(selected);
                },
            },
            {
                label: "Statistics badge",
                selected: this._statisticsModel.isBadgeVisible,
                onUpdate: ({ selected }) => {
                    this._statisticsModel.toggleBadge(selected);
                },
            },
        ];

        if (this._appStore.satelliteSearchPanel) {
            menuViewOptions.push({
                label: "Satellite search panel",
                selected: this._appStore.satelliteSearchPanel.isVisible,
                onUpdate: ({ selected }) => {
                    this._appStore.satelliteSearchPanel.toggle(selected);
                },
            });
        }

        const menuSimulation = new DropDownMenuItem(TOP_MENU_ITEMS.SIMULATION, [
            {
                label: "Orbit creation panel",
                selected: this._appStore.visualObjects.creationPanel.isVisible,
                onUpdate: ({ selected }) => {
                    this._appStore.visualObjects.creationPanel.toggle(selected);
                },
            },
            {
                label: "Transfer calculation panel",
                selected: this._appStore.visualObjects.transferCalculationPanel.isVisible,
                onUpdate: ({ selected }) => {
                    this._appStore.visualObjects.transferCalculationPanel.toggle(selected);
                },
            },
        ]);
        const menuEdit = new LinkMenuItem(TOP_MENU_ITEMS.EDIT);
        const menuView = new DropDownMenuItem(TOP_MENU_ITEMS.VIEW, menuViewOptions);
        const menuHelp = new DropDownMenuItem(TOP_MENU_ITEMS.HELP, [
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
        ]);

        return [menuSimulation, menuEdit, menuView, menuHelp];
    }
}

export { MenuItemType } from "./menu-items/menu-item-type";
