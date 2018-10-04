import React from "react";

import Panel from "../../common/panel";
import { Consumer } from "../../../store";

const CreationPanel = ({ className }) => (
    <Consumer>
        {({ store }) => {
            return store.viewSettings.showOrbitCreationPanel ? (
                <Panel
                    className={className}
                    id="creationPanel"
                    data-panel-name="creation"
                    caption="Orbit creation"
                    collapsedByDefault
                >
                    <div style={{ height: 44 }}>
                        <label className="panel__field">
                            Create Orbit: <button id="createOrbit">Create</button>
                        </label>
                    </div>
                </Panel>
            ) : null;
        }}
    </Consumer>
);

export default CreationPanel;
