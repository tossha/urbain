import { MenuItem } from "./menu-item";
import { MenuItemType } from "./menu-item-type";

export class LinkMenuItem extends MenuItem {
    constructor(label, { href = "", target = "_self" } = {}) {
        super({ label, type: MenuItemType.LINK });

        this.href = href;
        this.target = target;
    }

    get isClickable() {
        return Boolean(this.href);
    }
}
