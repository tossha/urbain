import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { RootContext } from "../../../../../store";
import DropDownMenuItem from "./drop-down-menu-item";
import "./drop-down-menu.scss";

class DropDownMenu extends Component {
    static contextType = RootContext;

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
    };

    handleSelect = selectedItem => {
        const { store, updateStore } = this.context;
        const dropDownMenuData = store.topMenu.find(item => item.label === this.props.text);

        dropDownMenuData.onSelect(selectedItem);
        updateStore(store);
    };

    render() {
        const { text } = this.props;
        const dropDownMenuData = this.context.store.topMenu.find(item => item.label === text);
        const options = dropDownMenuData ? dropDownMenuData.options : [];

        const hasOptionsToShow = options.length > 0;

        return (
            <ul className="drop-down-menu">
                <li>
                    <span className="drop-down-menu__toggler">
                        {text}
                        {hasOptionsToShow && <FontAwesomeIcon className="drop-down-menu__caret" icon="chevron-down" />}
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
