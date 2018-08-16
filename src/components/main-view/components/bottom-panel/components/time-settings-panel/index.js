import React from "react";
import Panel from "../../../../../common/panel";
import "./index.css";

function TimeSettingsPanel() {
    return (
        <Panel className="time-settings-panel" id="timePanel" data-panel-name="time" caption="Time">
            <div className="time-settings-panel__content">
                <label className="panel__field time-settings-panel__field">
                    <span className="panel__field-label">Current:</span>
                    <time id="currentDateValue">01.01.2000 12:00:00</time>
                    <button type="button" className="panel__button" id="useCurrentTime">
                        Now
                    </button>
                </label>
                <label className="panel__field time-settings-panel__field">
                    <span className="panel__field-label">Rate:</span>
                    <span id="timeScaleValue" />
                    <button type="button" className="panel__button" id="setRealTimeScale">
                        Real
                    </button>
                </label>
                <label className="panel__field time-settings-panel__field">
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
                </label>
            </div>
        </Panel>
    );
}

export default TimeSettingsPanel;
