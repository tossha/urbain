import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

import { AppStore } from "../../../store";
import Panel, { Field, FieldLabel, PanelButton } from "../../common/panel";

const CreationPanel = ({ className, appStore }) => (
    <Panel
        className={className}
        id="creationPanel"
        caption="Orbit creation"
        hidden={!appStore.visualObjects.creationPanel.isVisible}
    >
        <Field>
            <FieldLabel>Create orbit</FieldLabel>
            <PanelButton id="createOrbit">Create</PanelButton>
        </Field>
        <Field>
            <FieldLabel>Import</FieldLabel>
            <input type="text" id="dump" style={{ width: "150px" }} />
            <PanelButton id="importOrbit">Load</PanelButton>
        </Field>
    </Panel>
);

CreationPanel.propTypes = {
    className: PropTypes.string,
    appStore: PropTypes.isPrototypeOf(AppStore),
};

export default inject("appStore")(observer(CreationPanel));
