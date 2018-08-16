import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Panel from "../../../common/panel";
import "./index.css";
import KeplerianView from "./components/keplerian-view";
import CartesianVectorView from "./components/cartesian-vector-view";

const MetricsPanel = () => (
    <Panel id="metricsPanel" className="metrics-panel" caption="Metrics" titleIcon={<FontAwesomeIcon icon="bars" />}>
        <div className="metrics-panel__content">
            <div className="panel__field-set">
                <div className="panel__field">
                    <span className="panel__field-label">Object</span>
                    <span className="panel__field-control" id="metricsOf" />
                </div>
                <div className="panel__field">
                    <span className="panel__field-label">Relative to</span>
                    <span className="panel__field-control" id="relativeTo" />
                </div>
            </div>
            <div className="panel__field-set">
                <label className="panel__field panel__field--left-aligned">
                    <input
                        className="metrics-panel__angles-checker"
                        type="checkbox"
                        id="showAnglesOfSelectedOrbit"
                        defaultChecked
                    />
                    <span className="panel__field-label">Visualize angles</span>
                    <button className="metrics-panel__unload-object-button" type="button" id="unloadObject">
                        Unload object
                    </button>
                </label>
            </div>
            <div className="panel__field-set">
                <div className="panel__field panel__field-header">Main</div>
                <div className="panel__field">
                    <span className="panel__field-label">Orbit</span>
                    <span className="panel__field-control" id="elements-orbit-alt" />
                    <span className="metrics-panel__dimension">km</span>
                </div>
                <div className="panel__field">
                    <span className="panel__field-label">Avg height</span>
                    <span className="panel__field-control" id="elements-orbit-avg" />
                    <span className="metrics-panel__dimension">km</span>
                </div>
                <div className="panel__field">
                    <span className="panel__field-label">Altitude</span>
                    <span className="panel__field-control" id="elements-alt" />
                    <span className="metrics-panel__dimension">km</span>
                </div>
                <div className="panel__field">
                    <span className="panel__field-label">Speed</span>
                    <span className="panel__field-control" id="elements-speed" />
                    <span className="metrics-panel__dimension">m/s</span>
                </div>
                <div className="panel__field">
                    <span className="panel__field-label">Precession</span>
                    <span className="panel__field-control" id="elements-precession" />
                    <span className="metrics-panel__dimension">deg/day</span>
                </div>

                <div className="panel__field" id="row-node-time" style={{ display: "none" }}>
                    <span className="panel__field-label">Node local time</span>
                    <span className="panel__field-control" id="elements-node-time" />
                    <span className="metrics-panel__dimension" />
                </div>
            </div>

            <div className="panel__field-set">
                <div className="panel__field panel__field-header">Keplerian</div>
                <KeplerianView className="panel__field" />
            </div>

            <div className="panel__field-set">
                <div className="panel__field panel__field-header">Cartesian</div>
                <CartesianVectorView
                    className="metrics-panel__cartesian-position-vector js-metrics-panel-cartesian-position-vector"
                    vectorMagnitudeLabel="Position"
                    dimension="km"
                />
                <CartesianVectorView
                    className="metrics-panel__cartesian-velocity-vector js-metrics-panel-cartesian-velocity-vector"
                    vectorMagnitudeLabel="Velocity"
                    dimension="km/s"
                />
            </div>
        </div>
    </Panel>
);

export default MetricsPanel;
