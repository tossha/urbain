import React from "react";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import cn from "classnames";

import { VIEWPORT_ENTRY_ID } from "../../constants";
import SideBar from "../common/side-bar";
import BottomPanel from "./components/bottom-panel";
import CreationPanel from "./components/creation-panel";
import TransferCalculationPanel from "./components/transfer-calculation-panel";
import MetricsPanel from "./components/metrics-panel";
import ManeuverPanel from "./components/maneuver-panel";
import DynamicTrajectoryPanel from "./components/dynamic-trajectory-panel";
import SatelliteSearchPanel from "../satellite-search-panel";
import { AppStore } from "../../store";

import "./main-view.scss";

const MainView = ({ className, appStore }) => (
    <main className={cn(className, "main-view")}>
        <div id={VIEWPORT_ENTRY_ID} className="main-view__viewport-entry" />
        <SideBar className="main-view__left-side-bar">
            <CreationPanel className="main-view__creation-panel" />
            <ManeuverPanel className="main-view__maneuver-panel" />
            <TransferCalculationPanel className="main-view__transfer-calculation-panel" />
        </SideBar>
        <SideBar className="main-view__right-side-bar" right>
            <MetricsPanel />
            <DynamicTrajectoryPanel />
        </SideBar>
        <SatelliteSearchPanel
            className="main-view__satellite-search-panel"
            visible={appStore.visualObjects.satelliteSearchPanel.isVisible}
        />
        <BottomPanel className="main-view__bottom-panel" />
    </main>
);

MainView.propTypes = {
    className: PropTypes.string,
    appStore: PropTypes.instanceOf(AppStore),
};

export default inject("appStore")(observer(MainView));
