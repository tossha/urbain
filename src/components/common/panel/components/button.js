import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import Button from "../../button";

const PanelButton = ({ id, className, children }) => (
    <Button className={cn("panel__button", className)} id={id}>
        {children}
    </Button>
);

PanelButton.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.string,
};

export default PanelButton;
