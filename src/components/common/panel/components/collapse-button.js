import React from "react";
import PropTypes from "prop-types";

import ArrowLogo from "../../logos/arrow-logo";
import MaximizeLogo from "../../logos/maximize-logo";

const CollapseButton = ({ isCollapsed, onClick, isToRight = false, className = "", collapseDirection = "left" }) => (
    <button type="button" className={className} onClick={onClick}>
        {isCollapsed ? <MaximizeLogo /> : <ArrowLogo direction={collapseDirection} />}
    </button>
);

CollapseButton.propTypes = {
    className: PropTypes.string,
    isCollapsed: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    collapseDirection: PropTypes.oneOf(["right", "left"]),
};

export default CollapseButton;
