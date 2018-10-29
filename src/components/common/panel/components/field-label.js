import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const FieldLabel = ({
    className,
    tag: ComponentType = "span",
    normal = true,
    middle = false,
    small = false,
    children,
}) => {
    return (
        <ComponentType
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
    className: PropTypes.string,
    tag: PropTypes.string,
    normal: PropTypes.bool,
    middle: PropTypes.bool,
    small: PropTypes.bool,
    children: PropTypes.string,
};

export default FieldLabel;
