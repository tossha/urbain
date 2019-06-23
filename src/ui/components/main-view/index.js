import React, { Component, Suspense } from "react";
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

@inject("appStore")
@observer
class MainView extends Component {
    static propTypes = {
        className: PropTypes.string,
        appStore: PropTypes.instanceOf(AppStore),
    };

    componentDidMount() {
        this.props.appStore.setViewportElement(this._viewportElementRef.current);
    }

    _viewportElementRef = React.createRef();

    render() {
        const { className, appStore } = this.props;

        return (
            <main className={cn(className, "main-view")}>
                <div ref={this._viewportElementRef} className="main-view__viewport-entry" />
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
    }
}

export default MainView;
