import React from "react";
import { TOP_MENU_ITEMS } from "./constants";

class TopMenuItem {
    constructor(label, options = []) {
        this.label = label;
        this.options = options;
    }

    onSelect = selectedLabel => {
        this.options = this.options.map(option => ({
            ...option,
            selected: selectedLabel === option.label ? !option.selected : option.selected
        }));
    };
}

class Store {
    topMenu = [
        new TopMenuItem(TOP_MENU_ITEMS.SIMULATION, [
            {label: "Open Create orbit panel", selected: true},
            {label: "Open Transfer calculation panel", selected: true}
        ]),
        new TopMenuItem(TOP_MENU_ITEMS.EDIT),
        new TopMenuItem(TOP_MENU_ITEMS.VIEW, [
            {label: "Show Statistics", selected: false},
            {label: "Show Body Labels", selected: true},
        ]),
        new TopMenuItem(TOP_MENU_ITEMS.SETTINGS),
        new TopMenuItem(TOP_MENU_ITEMS.HELP),
    ];
}

const {Provider, Consumer} = React.createContext(new Store());
const store = new Store();

export { store, Provider, Consumer, TOP_MENU_ITEMS };
