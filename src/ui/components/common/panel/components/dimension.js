import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const Dimension = ({ id, className, children }) => {
    return (
        <span id={id} className={cn("panel__dimension", className)}>
            {children}
        </span>
    );
};

Dimension.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default Dimension;
