import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import SideBar from "../common/side-bar";
import BottomPanel from "./components/bottom-panel";
import CreationPanel from "./components/creation-panel";
import TransferCalculationPanel from "./components/transfer-calculation-panel";
import MetricsPanel from "./components/metrics-panel";
import ManeuverPanel from "./components/maneuver-panel";
import DynamicTrajectoryPanel from "./components/dynamic-trajectory-panel";
import SatelliteSearchPanel from "../satellite-search-panel/index";
import "./main-view.scss";

const MainView = ({ className }) => {
    return (
        <main className={cn("main-view", className)}>
            <div id="viewport-id" className="main-view__viewport-container" />
            <SideBar className="main-view__left-side-bar">
                <CreationPanel className="main-view__creation-panel" />
                <ManeuverPanel className="main-view__maneuver-panel" />
                <TransferCalculationPanel className="main-view__transfer-calculation-panel" />
            </SideBar>
            <SideBar className="main-view__right-side-bar" right>
                <MetricsPanel />
                <DynamicTrajectoryPanel />
            </SideBar>
            <SatelliteSearchPanel className="main-view__satellite-search-panel" />
            <BottomPanel className="main-view__bottom-panel" />
        </main>
    );
};

MainView.propTypes = {
    className: PropTypes.string,
};

export default MainView;
