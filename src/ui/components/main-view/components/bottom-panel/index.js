import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import CameraPanel from "./components/camera-panel/camera-panel";
import TimeLine from "./components/time-line";
import PauseButton from "./components/pause-button";
import TimeSettingsPanel from "./components/time-settings-panel";
import StatisticsBadge from "../../../statistics-badge";

import "./index.scss";

function BottomPanel({ className }) {
    return (
        <div className={cn(className, "bottom-panel")}>
            <TimeSettingsPanel className="bottom-panel__time-settings-panel" />
            <PauseButton className="bottom-panel__pause-button" />
            <div className="bottom-panel__time-line-container">
                <TimeLine className="bottom-panel__time-line" />
            </div>
            <CameraPanel className="bottom-panel__camera-panel" />
            <StatisticsBadge />
        </div>
    );
}

BottomPanel.propTypes = {
    className: PropTypes.string,
};

export default BottomPanel;
