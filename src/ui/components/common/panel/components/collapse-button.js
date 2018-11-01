import React from "react";
import PropTypes from "prop-types";

import Button from "../../button";
import ArrowLogo from "../../logos/arrow-logo";
import MaximizeLogo from "../../logos/maximize-logo";

const CollapseButton = ({ isCollapsed, onClick, isToRight = false, className = "", collapseDirection = "left" }) => (
    <Button className={className} onClick={onClick} small>
        {isCollapsed ? <MaximizeLogo /> : <ArrowLogo direction={collapseDirection} />}
    </Button>
);

CollapseButton.propTypes = {
    className: PropTypes.string,
    isCollapsed: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    collapseDirection: PropTypes.oneOf(["right", "left"]),
};

export default CollapseButton;
