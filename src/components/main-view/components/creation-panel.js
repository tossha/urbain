import React from "react";

import Panel from "../../common/panel";
import { Consumer } from "../../../store";

const CreationPanel = ({ className }) => (
    <Consumer>
        {({ store }) => (
            <Panel
                className={className}
                id="creationPanel"
                data-panel-name="creation"
                caption="Orbit creation"
                hidden={!store.viewSettings.showOrbitCreationPanel}
            >
                <div style={{ height: 44 }}>
                    <label className="panel__field">
                        Create Orbit: <button id="createOrbit">Create</button>
                    </label>
                </div>
            </Panel>
        )}
    </Consumer>
);

export default CreationPanel;
