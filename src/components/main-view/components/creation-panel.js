import React from "react";
import Panel from "../../common/panel";

const CreationPanel = () => (
    <Panel
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
);

export default CreationPanel;
