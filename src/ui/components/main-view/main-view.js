import React, { Suspense } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { RootContext } from "../../store";
import SideBar from "../common/side-bar";
import BottomPanel from "./components/bottom-panel";
import CreationPanel from "./components/creation-panel";
import TransferCalculationPanel from "./components/transfer-calculation-panel";
import MetricsPanel from "./components/metrics-panel";
import ManeuverPanel from "./components/maneuver-panel";
import DynamicTrajectoryPanel from "./components/dynamic-trajectory-panel";

import "./main-view.scss";

const SatelliteSearchPanel = React.lazy(() => import("../satellite-search-panel/index"));

const MainView = ({ className }) => {
    return (
        <RootContext.Consumer>
            {({ store }) => (
                <main className={cn(className, "main-view")}>
                    <div id="viewport-id" className="main-view__viewport-entry" />
                    <SideBar className="main-view__left-side-bar">
                        <CreationPanel className="main-view__creation-panel" />
                        <ManeuverPanel className="main-view__maneuver-panel" />
                        <TransferCalculationPanel className="main-view__transfer-calculation-panel" />
                    </SideBar>
                    <SideBar className="main-view__right-side-bar" right>
                        <MetricsPanel />
                        <DynamicTrajectoryPanel />
                    </SideBar>
                    {store.viewSettings.satelliteSearchPanel.isVisible ? (
                        <Suspense fallback={<div />}>
                            <SatelliteSearchPanel className="main-view__satellite-search-panel" />
                        </Suspense>
                    ) : null}
                    <BottomPanel className="main-view__bottom-panel" />
                </main>
            )}
        </RootContext.Consumer>
    );
};

MainView.propTypes = {
    className: PropTypes.string,
};

export default MainView;
