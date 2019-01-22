import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import DropdownIcon from "../logos/dropdown-icon";
import Button from "../button";
import "./index.scss";

function ExpandButton({ className, onClick, expanded = false }) {
    return (
        <Button
            className={cn(className, "expand-button", {
                "expand-button--expanded": expanded,
            })}
            onClick={onClick}
        >
            <DropdownIcon className="expand-button__icon" />
        </Button>
    );
}

ExpandButton.propTypes = {
    className: PropTypes.string,
    expanded: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ExpandButton;
