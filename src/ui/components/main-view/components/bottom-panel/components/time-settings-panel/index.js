import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import cn from "classnames";

import Panel, { Field, FieldLabel, FieldControl, PanelButton } from "../../../../../common/panel";
import TimeSettingsPanelStore from "./store/time-settings-panel-store";
import Logo from "./logo";
import TimeScaleSlider from "./components/time-scale-slider";
import Timer from "./components/timer";
import "./index.scss";

function TimeSettingsPanel({ className, timeSettingsPanelStore }) {
    const classNames = cn("time-settings-panel", className);

    return (
        <Panel
            className={classNames}
            id="timePanel"
            caption="Time"
            titleIcon={<Logo className="time-settings-panel__logo" />}
        >
            <Field>
                <FieldLabel middle>Current</FieldLabel>
                <FieldControl>
                    <Timer />
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
                    <TimeScaleSlider className="time-settings-panel__scale-slider" />
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
