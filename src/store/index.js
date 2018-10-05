import { ABOUT_PAGE_URL, TOP_MENU_ITEMS } from "./constants";
import { createContext } from "./context";
import { openLinkInNewTab } from "./utils";

class TopMenuItem {
    constructor(label, options = []) {
        this.label = label;
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
    constructor(simulation) {
        this._simulation = simulation;
    }

    viewSettings = {
        showStatistics: false,
        showBodyLabels: true,
        showOrbitCreationPanel: false,
        showTransferCalculationPanel: false,
    };

    topMenu = [
        new TopMenuItem(TOP_MENU_ITEMS.SIMULATION, [
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
        new TopMenuItem(TOP_MENU_ITEMS.EDIT),
        new TopMenuItem(TOP_MENU_ITEMS.VIEW, [
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
        ]),
        // new TopMenuItem(TOP_MENU_ITEMS.SETTINGS),
        new TopMenuItem(TOP_MENU_ITEMS.HELP, [
            {
                label: "About",
                onClick() {
                    openLinkInNewTab(ABOUT_PAGE_URL);
                },
            },
        ]),
    ];

    starSystems = [
        { label: "Solar System", value: "Solar_System" },
        { label: "KSP System", value: "KSP_System" },
    ];
}

const { Provider, Consumer } = createContext();

export { Store, TOP_MENU_ITEMS, Provider, Consumer };
