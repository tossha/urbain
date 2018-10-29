import React from "react";

import Panel, { Field, FieldLabel, PanelButton } from "../../common/panel";
import { Consumer } from "../../../store";

const CreationPanel = ({ className }) => (
    <Consumer>
        {({ store }) => (
            <Panel
                className={className}
                id="creationPanel"
                caption="Orbit creation"
                hidden={!store.viewSettings.showOrbitCreationPanel}
            >
                <Field>
                    <FieldLabel>Create Orbit</FieldLabel>
                    <PanelButton id="createOrbit">Create</PanelButton>
                </Field>
            </Panel>
        )}
    </Consumer>
);

export default CreationPanel;
