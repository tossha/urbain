import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const FieldControl = ({ id, className, fullSize = false, children }) => {
    return (
        <span
            id={id}
            className={cn("panel__field-control", { "panel__field-control--full-size": fullSize }, className)}
        >
            {children}
        </span>
    );
};

FieldControl.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    fullSize: PropTypes.bool,
    children: PropTypes.node,
};

export default FieldControl;
