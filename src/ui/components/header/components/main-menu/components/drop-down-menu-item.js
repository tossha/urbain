import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { ReactComponent as CheckIcon } from "../../../../common/images/check.svg";

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
        const iconClass = cn("drop-down-menu__menu-item-icon", {
            "drop-down-menu__menu-item-icon--unchecked": !selected,
        });

        return (
            <li className="drop-down-menu__menu-item" onClick={this.handleClick}>
                <CheckIcon className={iconClass} />
                {text}
            </li>
        );
    }
}

export default DropdownMenuItem;
