import React from "react";
import Select from "../../../common/select/select";
import "./star-system-selector.css";

const options = [
    { value: "Solar_System", label: "Solar System" },
    { value: "Not_Solar_System", label: "Not Solar System" },
];

function StarSystemSelector() {
    return (
        <div className="star-system-selector">
            <div className="star-system-selector__label">Star system</div>
            <Select className="star-system-selector__selector" options={options} value={options[0]} />
        </div>
    );
}

export default StarSystemSelector;
