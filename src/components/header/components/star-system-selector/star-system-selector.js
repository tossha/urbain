import React from "react";

import { Consumer } from "../../../../store";
import Select from "../../../common/select/select";
import "./star-system-selector.css";

function StarSystemSelector() {
    return (
        <Consumer>
            {({ store }) => (
                <div className="star-system-selector">
                    <div className="star-system-selector__label">Star system</div>
                    <Select
                        className="star-system-selector__selector"
                        options={store.starSystems}
                        value={store.starSystems[0]}
                    />
                </div>
            )}
        </Consumer>
    );
}

export default StarSystemSelector;
