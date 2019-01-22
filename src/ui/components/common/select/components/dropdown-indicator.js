import React from "react";
import { components } from "react-select";
import DropdownIcon from "../../logos/dropdown-icon";

import "./dropdown-indicator.scss";

const DropdownIndicator = props => {
    return (
        components.DropdownIndicator && (
            <components.DropdownIndicator {...props} className="dropdown-indicator">
                <DropdownIcon className="dropdown-indicator__icon" />
            </components.DropdownIndicator>
        )
    );
};

export default DropdownIndicator;
