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
                    <FieldLabel>Create orbit</FieldLabel>
                    <PanelButton id="createOrbit">Create</PanelButton>
                </Field>
                <Field>
                    <FieldLabel>Import</FieldLabel>
                    <input type="text" id="dump" style={{width: '150px'}}/>
                    <PanelButton id="importOrbit">Load</PanelButton>
                </Field>
            </Panel>
        )}
    </Consumer>
);

export default CreationPanel;
