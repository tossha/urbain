import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./index.css";
import CameraPanel from "./components/camera-panel/camera-panel";
import TimeLine from "./components/time-line";
import PauseButton from "./components/pause-button";
import TimeSettingsPanel from "./components/time-settings-panel";
import StatisticsBadge from "../statistics-badge/index";

function BottomPanel({ className }) {
    return (
        <div className={cn(className, "bottom-panel")}>
            <div className="bottom-panel__time-settings-panel-container">
                <TimeSettingsPanel />
            </div>
            <div className="bottom-panel__pause-button-container">
                <PauseButton />
            </div>
            <div className="bottom-panel__time-line-container">
                <TimeLine />
            </div>
            <div className="bottom-panel__camera-panel">
                <CameraPanel />
            </div>
            <StatisticsBadge />
        </div>
    );
}

BottomPanel.propTypes = {
    className: PropTypes.string,
};

export default BottomPanel;
