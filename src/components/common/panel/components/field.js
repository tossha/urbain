import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const Field = ({ className, leftAligned = false, centered = false, children }) => {
    return (
        <div
            className={cn(
                "panel__field",
                {
                    "panel__field--left-aligned": leftAligned,
                    "panel__field--centered": centered,
                },
                className,
            )}
        >
            {children}
        </div>
    );
};

Field.propTypes = {
    className: PropTypes.string,
    leftAligned: PropTypes.bool,
    centered: PropTypes.bool,
    children: PropTypes.node,
};

export default Field;
