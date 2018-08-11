import React from "react";
import cn from "classnames";

import "./main-view.css";
import BottomPanel from "./components/bottom-panel";
import CreationPanel from "./components/creation-panel";
import TransferCalculationPanel from "./components/transfer-calculation-panel";
import MetricsPanel from "./components/metrics-panel/index";
import SideBar from "../common/side-bar";

const MainView = ({ className, children }) => {
    return (
        <main className={cn(className, "main-view")}>
            <div id="viewport-id" />
            {children}
            <SideBar className="main-view__left-side-bar">
                <CreationPanel className="main-view__creation-panel" />
                <TransferCalculationPanel className="main-view__transfer-calculation-panel" />
            </SideBar>
            <SideBar className="main-view__right-side-bar" right>
                <MetricsPanel />
            </SideBar>
            <BottomPanel className="main-view__bottom-panel" />
        </main>
    );
};

export default MainView;
