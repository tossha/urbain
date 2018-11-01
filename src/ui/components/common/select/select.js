import React from "react";
import PropTypes from "prop-types";
import ReactSelect, { components } from "react-select";

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
        const transition = "opacity 300ms";

        return {
            ...base,
            color: DEFAULT.color,
            opacity,
            transition,
        };
    },

    dropdownIndicator: () => ({
        padding: 0,
        background: `url("/images/chevron-down-solid.svg") 0 0 no-repeat`,
        marginRight: 5,
        height: 10,
        width: 10,
    }),

    indicatorSeparator: () => ({
        display: "none",
    }),
};

const IndicatorsContainer = props => {
    return components.IndicatorsContainer && <components.IndicatorsContainer {...props} />;
};

const DropdownIndicator = props => {
    return (
        components.DropdownIndicator && (
            <components.DropdownIndicator {...props}>
                <span />
            </components.DropdownIndicator>
        )
    );
};

const Select = ({ id, className, options, value, onSelect = () => {} }) => {
    return (
        <ReactSelect
            id={id}
            className={className}
            classNamePrefix="select"
            placeholder=""
            styles={customSelectStyles}
            isSearchable={false}
            options={options}
            defaultValue={value}
            components={{ IndicatorsContainer, DropdownIndicator }}
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
