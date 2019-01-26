import { MenuItem } from "./menu-item";
import { MenuItemType } from "./menu-item-type";

export class DropDownMenuItem extends MenuItem {
    /**
     * @param {string} label
     * @param {array} options
     */
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
