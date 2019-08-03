import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

import Panel, { Field, FieldLabel, FieldControl, PanelButton } from "../../../../../common/panel";
import TimeSettingsPanelStore from "./store/time-settings-panel-store";
import Logo from "./logo";
import "./index.scss";

function TimeSettingsPanel({ className, timeSettingsPanelStore }) {
    const formattedDate = timeSettingsPanelStore.formattedDate || "01.01.2000 12:00:00";

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
                    <time dateTime={formattedDate}>{formattedDate}</time>
                </FieldControl>
                <PanelButton onClick={timeSettingsPanelStore.onSetCurrentTime}>Now</PanelButton>
            </Field>
            <Field>
                <FieldLabel middle>Rate</FieldLabel>
                <FieldControl>{timeSettingsPanelStore.formattedTimeScale}</FieldControl>
                <PanelButton onClick={timeSettingsPanelStore.onSetRealTimeScale}>Real</PanelButton>
            </Field>
            <Field centered>
                <FieldControl fullSize>
                    <input
                        type="range"
                        className="time-settings-panel__scale-slider"
                        min={-1}
                        max={1}
                        step={0.001}
                        value={timeSettingsPanelStore.sliderValue}
                        onChange={timeSettingsPanelStore.onTimeScaleSliderChange}
                    />
                </FieldControl>
            </Field>
        </Panel>
    );
}

TimeSettingsPanel.propTypes = {
    className: PropTypes.string,
    timeSettingsPanelStore: PropTypes.instanceOf(TimeSettingsPanelStore),
};

export default inject("timeSettingsPanelStore")(observer(TimeSettingsPanel));
