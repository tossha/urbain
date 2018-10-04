import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Consumer } from "../../../../store";
import DropDownMenuItem from "./drop-down-menu-item";
import "./drop-down-menu.css";

class DropDownMenu extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                selected: PropTypes.bool.isRequired,
                onUpdate: PropTypes.func,
                onClick: PropTypes.func,
            }),
        ).isRequired,
        onSelect: PropTypes.func,
    };

    handleSelect = selectedItem => {
        const { store, updateStore, text } = this.props;
        const dropDownMenuData = store.topMenu.find(item => item.label === text);

        dropDownMenuData.onSelect(selectedItem);
        updateStore(store);
    };

    render() {
        const { text, options } = this.props;
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

export default props => (
    <Consumer>
        {({ store, updateStore }) => {
            const dropDownMenuData = store.topMenu.find(item => item.label === props.text);
            const options = dropDownMenuData ? dropDownMenuData.options : [];

            return <DropDownMenu {...props} store={store} updateStore={updateStore} options={options} />;
        }}
    </Consumer>
);
