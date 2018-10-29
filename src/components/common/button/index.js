import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./index.scss";

const Button = ({ id, className, children, small = false, disabled = false, onClick = () => {} }) => (
    <button
        id={id}
        type="button"
        className={cn(
            "button",
            {
                "button--disabled": disabled,
                "button--small": small,
            },
            className,
        )}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
);

Button.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    small: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
};

export default Button;
