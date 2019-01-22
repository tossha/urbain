import React from "react";
import PropTypes from "prop-types";
import ReactSelect from "react-select";
import cn from "classnames";

import DropdownIndicator from "./components/dropdown-indicator";

const DEFAULT = {
    background: "var(--black)",
    color: "var(--white-text)",
    containerHeight: 24,
};

const customSelectStyles = {
    container: base => ({
        ...base,
        background: DEFAULT.background,
        color: DEFAULT.color,
        minHeight: DEFAULT.containerHeight,
        height: DEFAULT.containerHeight,
        minWidth: 50,
    }),

    control: base => ({
        ...base,
        background: DEFAULT.background,
        borderRadius: 0,
        borderStyle: "none",
        minHeight: DEFAULT.containerHeight,
        height: DEFAULT.containerHeight,
    }),

    menu: base => ({
        ...base,
        borderRadius: 0,
        marginTop: 0,
        marginBottom: 0,
    }),

    menuList: base => ({
        ...base,
        background: "var(--dark-gray)",
    }),

    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "var(--gray)" : "transparent",
    }),

    singleValue: (base, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;

        return {
            ...base,
            opacity,
            color: DEFAULT.color,
        };
    },

    indicatorSeparator: () => ({
        display: "none",
    }),
};

const Select = ({ id, className, options, value, onSelect = () => {} }) => {
    const blockName = "select";

    return (
        <ReactSelect
            id={id}
            className={cn(blockName, className)}
            classNamePrefix={blockName}
            placeholder=""
            styles={customSelectStyles}
            isSearchable={false}
            options={options}
            defaultValue={value}
            components={{ DropdownIndicator }}
            onChange={onSelect}
        />
    );
};

export const optionPropTypes = PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
});

Select.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    options: PropTypes.arrayOf(optionPropTypes).isRequired,
    value: optionPropTypes,
    onSelect: PropTypes.func,
};

export default Select;
