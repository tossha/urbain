import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import Button from "../../button";

const PanelButton = ({ id, className, onClick, children }) => (
    <Button className={cn("panel__button", className)} id={id} onClick={onClick}>
        {children}
    </Button>
);

PanelButton.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.string,
};

export default PanelButton;
