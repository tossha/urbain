import { MenuItemType } from "./menu-item-type";

export class MenuItem {
    constructor({ label, type = MenuItemType.NONE, onClick = () => {} }) {
        this.label = label;
        this.type = type;
        this.onClick = onClick;
    }

    get isClickable() {
        return true;
    }
}
