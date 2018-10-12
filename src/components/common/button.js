import React from "react";
import cn from "classnames";

export default ({ className, text, disabled, onClick }) => (
    <button
        type="button"
        className={cn("button", { "button--disabled": disabled }, className)}
        onClick={onClick}
        disabled={disabled}
    >
        {text}
    </button>
);
