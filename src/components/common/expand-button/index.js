import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
            <FontAwesomeIcon className="expand-button__icon" icon="chevron-down" />
        </Button>
    );
}

ExpandButton.propTypes = {
    className: PropTypes.string,
    expanded: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ExpandButton;
