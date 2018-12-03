import { showWizard, wizardIds } from "../components/tutorials";
import { openLinkInNewTab } from "../utils";
import { HELP_PAGE_URL, TOP_MENU_ITEMS } from "./constants";
import MenuItemType from "./menu-item-type";

class MenuItem {
    constructor({ label, type = MenuItemType.NONE, onClick = () => {} }) {
        this.label = label;
        this.type = type;
    }

    get isClickable() {
        return true;
    }
}

class LinkMenuItem extends MenuItem {
    constructor(label, { href = "", target = "_self" } = {}) {
        super({ label, type: MenuItemType.LINK });

        this.href = href;
        this.target = target;
    }

    get isClickable() {
        return Boolean(this.href);
    }
}

class DropDownMenuItem extends MenuItem {
    constructor(label, options = []) {
        super({ label, type: MenuItemType.DROPDOWN });

        this.options = options;
    }

    onSelect = selectedLabel => {
        this.options = this.options.map(option => {
            const newOption = {
                ...option,
                selected: selectedLabel === option.label ? !option.selected : option.selected,
            };

            if (selectedLabel === option.label && option.onUpdate) {
                option.onUpdate(newOption);
            }

            return newOption;
        });
    };
}

class Store {
    constructor(simulation, loadTLE) {
        this._simulation = simulation;
        this._loadTLE = loadTLE;
    }

    viewSettings = {
        showStatistics: false,
        showBodyLabels: true,
        showOrbitCreationPanel: false,
        showTransferCalculationPanel: false,
        showSatelliteSearchPanel: false,
    };

    topMenu = [
        new DropDownMenuItem(TOP_MENU_ITEMS.SIMULATION, [
            {
                label: "Orbit creation panel",
                selected: this.viewSettings.showOrbitCreationPanel,
                onUpdate: ({ selected }) => {
                    this.viewSettings.showOrbitCreationPanel = selected;
                },
            },
            {
                label: "Transfer calculation panel",
                selected: this.viewSettings.showTransferCalculationPanel,
                onUpdate: ({ selected }) => {
                    this.viewSettings.showTransferCalculationPanel = selected;
                },
            },
        ]),
        new LinkMenuItem(TOP_MENU_ITEMS.EDIT),
        new DropDownMenuItem(TOP_MENU_ITEMS.VIEW, [
            {
                label: "Body Labels",
                selected: this.viewSettings.showBodyLabels,
                onUpdate: ({ selected }) => {
                    this._simulation.settings.ui.showBodyLabels = selected;
                    this.viewSettings.showBodyLabels = selected;
                },
            },
            {
                label: "Statistics badge",
                selected: false,
                onUpdate: ({ selected }) => {
                    this.viewSettings.showStatistics = selected;
                },
            },
            {
                label: "Satellite search panel",
                selected: this.viewSettings.showSatelliteSearchPanel,
                onUpdate: ({ selected }) => {
                    this.viewSettings.showSatelliteSearchPanel = selected;
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

    get starSystemSelectorSettings() {
        const { starSystemManager } = this._simulation;

        return {
            options: starSystemManager.starSystems,
            defaultValue: starSystemManager.defaultStarSystem,
            onSelect: item => starSystemManager.loadByIdx(item.idx),
        };
    }

    loadSatellite = noradId => {
        return this._loadTLE(noradId);
    };

    unloadSatellite = noradId => {
        return this._simulation.starSystem.deleteObject(-(100000 + (0 | noradId)));
    };
}

export default Store;
