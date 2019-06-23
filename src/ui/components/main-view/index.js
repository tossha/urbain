import React, { Suspense } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import cn from "classnames";

import SideBar from "../common/side-bar";
import BottomPanel from "./components/bottom-panel";
import CreationPanel from "./components/creation-panel";
import TransferCalculationPanel from "./components/transfer-calculation-panel";
import MetricsPanel from "./components/metrics-panel";
import ManeuverPanel from "./components/maneuver-panel";
import DynamicTrajectoryPanel from "./components/dynamic-trajectory-panel";
import AppStore from "../../stores/app-store";

import "./index.scss";
const SatelliteSearchPanel = React.lazy(() => import("../../../features/satellite-search"));

const MainView = ({ className, viewportId, appStore }) => (
    <main className={cn(className, "main-view")}>
        <div id={viewportId} className="main-view__viewport-entry" />
        <SideBar className="main-view__left-side-bar">
            <CreationPanel className="main-view__creation-panel" />
            <ManeuverPanel className="main-view__maneuver-panel" />
            <TransferCalculationPanel className="main-view__transfer-calculation-panel" />
        </SideBar>
        <SideBar className="main-view__right-side-bar" right>
            <MetricsPanel />
            <DynamicTrajectoryPanel />
        </SideBar>
        {appStore.satelliteSearchPanel && (
            <Suspense fallback={<div />}>
                <SatelliteSearchPanel className="main-view__satellite-search-panel" />
            </Suspense>
        )}
        <BottomPanel className="main-view__bottom-panel" />
    </main>
);

MainView.propTypes = {
    className: PropTypes.string,
    viewportId: PropTypes.string.isRequired,
    appStore: PropTypes.instanceOf(AppStore),
};

export default inject("appStore")(observer(MainView));
