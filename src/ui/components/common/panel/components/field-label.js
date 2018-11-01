import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const FieldLabel = ({
    id,
    className,
    tag: ComponentType = "span",
    normal = true,
    middle = false,
    small = false,
    children,
}) => {
    return (
        <ComponentType
            id={id}
            className={cn(
                "panel__field-label",
                {
                    "panel__field-label--normal": normal,
                    "panel__field-label--middle": middle,
                    "panel__field-label--small": small,
                },
                className,
            )}
        >
            {children}
        </ComponentType>
    );
};

FieldLabel.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    tag: PropTypes.string,
    normal: PropTypes.bool,
    middle: PropTypes.bool,
    small: PropTypes.bool,
    children: PropTypes.node,
};

export default FieldLabel;
