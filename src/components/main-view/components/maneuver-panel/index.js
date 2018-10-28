import React from "react";

import Panel from "../../../common/panel";
import "./index.css";

const ManeuverPanel = ({ className }) => (
    <Panel
        id="maneuverPanel"
        className={className}
        caption="Maneuver"
        collapseDirection="left"
    >
        <div className="metrics-panel__content">
            <div className="panel__field-set">
                <label className="panel__field panel__field--centered">
                    <button className="maneuver-panel__button" type="button" id="prev-burn">
                        Prev burn
                    </button>
                    <span className="panel__field-label" id="burn-name"></span>
                    <button className="maneuver-panel__button" type="button" id="next-burn">
                        Next burn
                    </button>
                </label>
            </div>

            <div className="panel__field-set">
                <div className="panel__field panel__field-header">Increment</div>
                <div className="panel__field">
                    <span className="panel__field-label-small" id="increment"></span>
                    <div className="maneuver-panel__button-block">
                        <button className="maneuver-panel__button" type="button" id="incr001">0.01</button>
                        <button className="maneuver-panel__button" type="button" id="incr01">0.1</button>
                        <button className="maneuver-panel__button" type="button" id="incr1">1</button>
                        <button className="maneuver-panel__button" type="button" id="incr10">10</button>
                        <button className="maneuver-panel__button" type="button" id="incr100">100</button>
                        <button className="maneuver-panel__button" type="button" id="incr1000">1000</button>
                    </div>
                </div>
            </div>

            <div className="panel__field-set">
                <div className="panel__field panel__field-header">Time</div>
                <div className="panel__field">
                    <span className="panel__field-label">Date</span>
                    <span className="panel__field-control" id="burn-date" />
                </div>
                <div className="panel__field">
                    <span className="panel__field-label">Epoch</span>
                    <span className="panel__field-control" id="burn-epoch" />
                    <div className="maneuver-panel__button-block">
                        <button className="maneuver-panel__button" type="button" id="epoch-minus">-</button>
                        <button className="maneuver-panel__button" type="button" id="epoch-plus">+</button>
                    </div>
                </div>
            </div>

            <div className="panel__field-set">
                <div className="panel__field panel__field-header">Impulse</div>
                <div className="panel__field">
                    <span className="panel__field-label">Prograde</span>
                    <span className="panel__field-control" id="burn-prograde" />
                    <span className="metrics-panel__dimension">m/s</span>
                    <div className="maneuver-panel__button-block">
                        <button className="maneuver-panel__button" type="button" id="prograde-zero">0</button>
                        <button className="maneuver-panel__button" type="button" id="prograde-minus">-</button>
                        <button className="maneuver-panel__button" type="button" id="prograde-plus">+</button>
                    </div>
                </div>
                <div className="panel__field">
                    <span className="panel__field-label">Normal</span>
                    <span className="panel__field-control" id="burn-normal" />
                    <span className="metrics-panel__dimension">m/s</span>
                    <div className="maneuver-panel__button-block">
                        <button className="maneuver-panel__button" type="button" id="normal-zero">0</button>
                        <button className="maneuver-panel__button" type="button" id="normal-minus">-</button>
                        <button className="maneuver-panel__button" type="button" id="normal-plus">+</button>
                    </div>
                </div>
                <div className="panel__field">
                    <span className="panel__field-label">Radial</span>
                    <span className="panel__field-control" id="burn-radial" />
                    <span className="metrics-panel__dimension">m/s</span>
                    <div className="maneuver-panel__button-block">
                        <button className="maneuver-panel__button" type="button" id="radial-zero">0</button>
                        <button className="maneuver-panel__button" type="button" id="radial-minus">-</button>
                        <button className="maneuver-panel__button" type="button" id="radial-plus">+</button>
                    </div>
                </div>
                <div className="panel__field">
                    <span className="panel__field-label">Total</span>
                    <span className="panel__field-control" id="burn-total" />
                    <span className="metrics-panel__dimension">m/s</span>
                </div>
            </div>

        </div>
    </Panel>
);

export default ManeuverPanel;
