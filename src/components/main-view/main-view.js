import React from "react";
import cn from "classnames";
import "./main-view.css";
import BottomPanel from "./components/bottom-panel";
import { CreationPanel } from "./components/creation-panel";
import { LambertPanel } from "./components/lambert-panel";
import { MetricsPanel } from "./components/metrics-panel";

const MainView = ({ className, children }) => {
    return (
        <main className={cn(className, "main-view")}>
            {children}
            <div id="leftPanel"/>
            <div id="viewport-id"/>
            <MetricsPanel/>
            <BottomPanel className="main-view__bottom-panel"/>
            <CreationPanel/>
            <LambertPanel/>
        </main>
    );
};

export default MainView;
