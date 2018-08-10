import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DropdownMenuItem extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
    };

    handleClick = () => {
        this.props.onClick(this.props.text);
    };

    render() {
        const { text, selected } = this.props;

        return (
            <li className="drop-down-menu__menu-item" onClick={this.handleClick}>
                <span className="drop-down-menu__menu-item-icon">{selected && <FontAwesomeIcon icon="check" />}</span>
                {text}
            </li>
        );
    }
}

export default DropdownMenuItem;
