import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./index.scss";

function ExpandButton({ className, onClick, expanded = false }) {
    return (
        <button
            type="button"
            className={cn(className, "expand-button", {
                "expand-button--expanded": expanded,
            })}
            onClick={onClick}
        >
            <FontAwesomeIcon className="expand-button__icon" icon="chevron-down" />
        </button>
    );
}

ExpandButton.propTypes = {
    className: PropTypes.string,
    expanded: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ExpandButton;
