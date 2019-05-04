import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

import { AppStore } from "../../../../../stores";
import DropdownIcon from "../../../../common/logos/dropdown-icon";
import DropDownMenuItem from "./drop-down-menu-item";
import "./drop-down-menu.scss";

@inject("appStore")
@observer
class DropDownMenu extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                selected: PropTypes.bool,
                onUpdate: PropTypes.func,
                onClick: PropTypes.func,
            }),
        ).isRequired,
        onSelect: PropTypes.func,
        appStore: PropTypes.instanceOf(AppStore),
    };

    get dropDownMenuData() {
        return this.props.appStore.header.mainMenu.find(item => item.label === this.props.text);
    }

    handleSelect = selectedItem => {
        this.dropDownMenuData.onSelect(selectedItem);
    };

    render() {
        const { text } = this.props;
        const dropDownMenuData = this.dropDownMenuData;
        const options = dropDownMenuData ? dropDownMenuData.options : [];

        const hasOptionsToShow = options.length > 0;

        return (
            <ul className="drop-down-menu">
                <li>
                    <span className="drop-down-menu__toggler">
                        {text}
                        {hasOptionsToShow && <DropdownIcon className="drop-down-menu__caret" />}
                    </span>
                    {hasOptionsToShow && (
                        <ul className="drop-down-menu__menu">
                            {options.map(({ label, selected, onClick }) => {
                                return (
                                    <DropDownMenuItem
                                        key={label}
                                        selected={selected}
                                        text={label}
                                        onClick={onClick || this.handleSelect}
                                    />
                                );
                            })}
                        </ul>
                    )}
                </li>
            </ul>
        );
    }
}

export default DropDownMenu;
