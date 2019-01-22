import React from "react";

import Panel, { Field, FieldLabel, PanelButton } from "../../common/panel";

const DynamicTrajectoryPanel = () => (
    <Panel id="dynamicTrajectoryPanel" caption="Dynamic trajectory" collapseDirection="right">
        <Field>
            <FieldLabel>Export trajectory</FieldLabel>
            <PanelButton id="dump">dump</PanelButton>
        </Field>
    </Panel>
);

export default DynamicTrajectoryPanel;
