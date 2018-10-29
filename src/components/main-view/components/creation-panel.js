import React from "react";

import Panel from "../../common/panel";
import Button from "../../common/button";
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
                <div className="panel__field">
                    <span>Create Orbit</span>
                    <Button className="panel__button" id="createOrbit">
                        Create
                    </Button>
                </div>
            </Panel>
        )}
    </Consumer>
);

export default CreationPanel;
