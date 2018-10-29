import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const FieldSet = ({ className, children }) => {
    return <span className={cn("panel__field-set", className)}>{children}</span>;
};

FieldSet.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

export default FieldSet;
