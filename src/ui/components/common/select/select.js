import React from "react";
import PropTypes from "prop-types";
import ReactSelect from "react-select";
import cn from "classnames";

import DropdownIndicator from "./components/dropdown-indicator";

const Color = {
    Black: "var(--black)",
    Gray: "var(--gray)",
    DarkGray: "var(--dark-gray)",
    WhiteText: "var(--white-text)",
};

const DEFAULT = {
    background: Color.Black,
    color: Color.WhiteText,
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
        background: Color.DarkGray,
    }),

    option: (base, { isSelected, isFocused, isDisabled }) => ({
        ...base,
        ":active": {
            ...base[":active"],
            backgroundColor: !isDisabled && (isSelected ? Color.Gray : Color.DarkGray),
        },
        backgroundColor: isSelected ? Color.Gray : isFocused ? Color.DarkGray : null,
        cursor: "pointer",
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

    dropdownIndicator: () => ({
        padding: 0,
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
