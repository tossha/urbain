import React from "react";

import Panel, { Field, FieldLabel, FieldControl, PanelButton } from "../../../../../common/panel";
import Logo from "./logo";
import "./index.scss";

function TimeSettingsPanel({ className }) {
    return (
        <Panel
            className={`time-settings-panel ${className}`}
            id="timePanel"
            caption="Time"
            titleIcon={<Logo className="time-settings-panel__logo" />}
        >
            <Field>
                <FieldLabel middle>Current</FieldLabel>
                <FieldControl>
                    <time id="currentDateValue">01.01.2000 12:00:00</time>
                </FieldControl>
                <PanelButton id="useCurrentTime">Now</PanelButton>
            </Field>
            <Field>
                <FieldLabel middle>Rate</FieldLabel>
                <FieldControl id="timeScaleValue" />
                <PanelButton id="setRealTimeScale">Real</PanelButton>
            </Field>
            <Field centered>
                <FieldControl fullSize>
                    <input
                        id="timeScaleSlider"
                        type="range"
                        className="time-settings-panel__scale-slider"
                        min="-1"
                        max="1"
                        step="0.001"
                        defaultValue="0.001"
                        style={{ width: "100%" }}
                    />
                </FieldControl>
            </Field>
        </Panel>
    );
}

export default TimeSettingsPanel;
