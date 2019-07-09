import React from "react";
import PropTypes from "prop-types";
import { inject } from "mobx-react";

import Select, { optionPropTypes } from "../../../common/select/select";
import "./index.scss";

function StarSystemSelector({ options, defaultValue, onSelect }) {
    return (
        <div className="star-system-selector">
            <div className="star-system-selector__label">Universe</div>
            <Select
                className="star-system-selector__selector"
                options={options}
                value={defaultValue || options[0]}
                onSelect={onSelect}
            />
        </div>
    );
}

StarSystemSelector.propTypes = {
    options: PropTypes.arrayOf(optionPropTypes).isRequired,
    defaultValue: optionPropTypes,
    onSelect: PropTypes.func,
};

export default inject(({ universeSelectorStore }) => {
    const { options, defaultValue, onSelect } = universeSelectorStore;

    return {
        options,
        defaultValue,
        onSelect,
    };
})(StarSystemSelector);
