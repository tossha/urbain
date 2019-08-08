import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

function Slider({ className = "", value, onChange, step = 0.001, min = -1, max = 1 }) {
    const classNames = cn("slider", className);

    return (
        <input type="range" className={classNames} min={min} max={max} step={step} value={value} onChange={onChange} />
    );
}

Slider.propTypes = {
    className: PropTypes.string,
    step: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Slider;
