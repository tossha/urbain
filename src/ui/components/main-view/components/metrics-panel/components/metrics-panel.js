import React from "react";
import { ReactComponent as BarsIcon } from "../../../../common/images/menu.svg";

import Dialog from "../../../../common/dialog";
import { FieldSet, Field, FieldLabel, FieldControl, Dimension } from "../../../../common/panel";
import KeplerianView from "./keplerian-view";
import CartesianVectorView from "./cartesian-vector-view";
import "../index.scss";

const MetricsPanel = ({ onMetricsPanelClose }) => (
    <Dialog
        draggable
        id="metricsPanel"
        className="panel metrics-panel"
        caption="Metrics"
        titleIcon={<BarsIcon className="metrics-panel__icon" />}
        onClose={onMetricsPanelClose}
    >
        <div className="metrics-panel__content">
            <FieldSet>
                <Field>
                    <FieldLabel>Object</FieldLabel>
                    <FieldControl id="metricsOf" />
                </Field>
                <Field>
                    <FieldLabel>Relative to</FieldLabel>
                    <FieldControl id="relativeTo" />
                </Field>
            </FieldSet>
            <FieldSet>
                <Field leftAligned>
                    <FieldLabel tag="label">
                        <input
                            className="metrics-panel__angles-checker"
                            type="checkbox"
                            id="showAnglesOfSelectedOrbit"
                            defaultChecked
                        />
                        Show angles
                    </FieldLabel>
                    <button className="metrics-panel__unload-object-button" type="button" id="unloadObject">
                        Unload object
                    </button>
                </Field>
            </FieldSet>
            <FieldSet>
                <Field className="panel__field-header">Main</Field>
                <Field>
                    <FieldLabel>Orbit</FieldLabel>
                    <FieldControl id="elements-orbit-alt" />
                    <Dimension>km</Dimension>
                </Field>
                <Field>
                    <FieldLabel>Avg height</FieldLabel>
                    <FieldControl id="elements-orbit-avg" />
                    <Dimension>km</Dimension>
                </Field>
                <Field>
                    <FieldLabel>Altitude</FieldLabel>
                    <FieldControl id="elements-alt" />
                    <Dimension>km</Dimension>
                </Field>
                <Field>
                    <FieldLabel>Speed</FieldLabel>
                    <FieldControl id="elements-speed" />
                    <Dimension>m/s</Dimension>
                </Field>
                <Field>
                    <FieldLabel>Precession</FieldLabel>
                    <FieldControl id="elements-precession" />
                    <Dimension>deg/day</Dimension>
                </Field>

                <Field id="row-node-time" style={{ display: "none" }}>
                    <FieldLabel>Node local time</FieldLabel>
                    <FieldControl id="elements-node-time" />
                    <Dimension />
                </Field>
            </FieldSet>

            <FieldSet>
                <Field className="panel__field-header">Keplerian</Field>
                <KeplerianView className="panel__field" />
            </FieldSet>

            <FieldSet>
                <Field className="panel__field-header">Cartesian</Field>
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
            </FieldSet>
        </div>
    </Dialog>
);

export default MetricsPanel;
