import React from "react";

import Panel from "../../../../../common/panel";
import Button from "../../../../../common/button";
import Logo from "./logo";
import "./index.scss";

function TimeSettingsPanel({ className }) {
    return (
        <Panel
            className={`time-settings-panel ${className}`}
            id="timePanel"
            data-panel-name="time"
            caption="Time"
            titleIcon={<Logo className="time-settings-panel__logo" />}
        >
            <div className="panel__field time-settings-panel__field">
                <span className="panel__field-label panel__field-label--middle">Current</span>
                <time className="panel__field-control" id="currentDateValue">
                    01.01.2000 12:00:00
                </time>
                <Button className="panel__button" id="useCurrentTime">
                    Now
                </Button>
            </div>
            <div className="panel__field time-settings-panel__field">
                <span className="panel__field-label panel__field-label--middle">Rate</span>
                <span className="panel__field-control" id="timeScaleValue" />
                <Button className="panel__button" id="setRealTimeScale">
                    Real
                </Button>
            </div>
            <div className="panel__field time-settings-panel__field">
                <input
                    id="timeScaleSlider"
                    type="range"
                    className="time-settings-panel__scale-slider"
                    min="-1"
                    max="1"
                    step="0.001"
                    defaultValue={"0.001"}
                    style={{ width: "100%" }}
                />
            </div>
        </Panel>
    );
}

export default TimeSettingsPanel;
