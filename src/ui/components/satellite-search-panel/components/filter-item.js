import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

export function FilterItem({ value, onSwitch, filterId, label }) {
    const isChecked = value === filterId;

    return (
        <div className={cn("filter-selector__item", isChecked && "filter-selector__item--active")}>
            <input
                className="filter-selector__radio"
                type="radio"
                id={filterId}
                name="params"
                value={filterId}
                checked={isChecked}
                onChange={onSwitch}
            />
            <label className="filter-selector__label" htmlFor={filterId}>
                {label}
            </label>
        </div>
    );
}

FilterItem.propTypes = {
    value: PropTypes.string.isRequired,
    onSwitch: PropTypes.func.isRequired,
    filterId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};
