import React from "react";

import Panel, { Field, FieldLabel, PanelButton } from "../../common/panel";
import { Consumer } from "../../../store";

const DynamicTrajectoryPanel = () => (
    <Consumer>
        {({ store }) => (
            <Panel
                id="dynamicTrajectoryPanel"
                caption="Dynamic trajectory"
                collapseDirection="right"
            >
                <Field>
                    <FieldLabel>Export trajectory</FieldLabel>
                    <PanelButton id="dump">dump</PanelButton>
                </Field>
            </Panel>
        )}
    </Consumer>
);

export default DynamicTrajectoryPanel;
