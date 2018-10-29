import React from "react";

import Panel from "../../../common/panel";
import Button from "../../../common/button";
import "./index.scss";

const ManeuverPanel = ({ className }) => (
    <Panel id="maneuverPanel" className={`maneuver-panel ${className}`} caption="Maneuver" collapseDirection="left">
        <div className="maneuver-panel__content">
            <div className="panel__field-set">
                <label className="panel__field panel__field--centered">
                    <Button className="maneuver-panel__button" id="prev-burn">
                        Prev burn
                    </Button>
                    <span className="panel__field-label" id="burn-name" />
                    <Button className="maneuver-panel__button" id="next-burn">
                        Next burn
                    </Button>
                </label>
            </div>

            <div className="panel__field-set">
                <div className="panel__field panel__field-header">Increment</div>
                <div className="panel__field panel__field--centered">
                    <span className="panel__field-label panel__field-label--small" id="increment" />
                    <span className="panel__field-control maneuver-panel__buttons">
                        <Button className="maneuver-panel__button" id="incr001">
                            0.01
                        </Button>
                        <Button className="maneuver-panel__button" id="incr01">
                            0.1
                        </Button>
                        <Button className="maneuver-panel__button" id="incr1">
                            1
                        </Button>
                        <Button className="maneuver-panel__button" id="incr10">
                            10
                        </Button>
                        <Button className="maneuver-panel__button" id="incr100">
                            100
                        </Button>
                        <Button className="maneuver-panel__button" id="incr1000">
                            1000
                        </Button>
                    </span>
                </div>
            </div>

            <div className="panel__field-set">
                <div className="panel__field panel__field-header">Time</div>
                <div className="panel__field">
                    <span className="panel__field-label">Date</span>
                    <span className="panel__field-control" id="burn-date" />
                </div>
                <div className="panel__field panel__field--centered">
                    <span className="panel__field-label">Epoch</span>
                    <span className="panel__field-control" id="burn-epoch" />
                    <span className="maneuver-panel__buttons">
                        <Button className="maneuver-panel__button" id="epoch-minus">
                            -
                        </Button>
                        <Button className="maneuver-panel__button" id="epoch-plus">
                            +
                        </Button>
                    </span>
                </div>
            </div>

            <div className="panel__field-set">
                <div className="panel__field panel__field-header">Impulse</div>
                <div className="panel__field panel__field--centered">
                    <span className="panel__field-label">Prograde</span>
                    <span className="panel__field-control" id="burn-prograde" />
                    <span className="panel__dimension">m/s</span>
                    <span className="maneuver-panel__buttons">
                        <Button className="maneuver-panel__button" id="prograde-zero">
                            0
                        </Button>
                        <Button className="maneuver-panel__button" id="prograde-minus">
                            -
                        </Button>
                        <Button className="maneuver-panel__button" id="prograde-plus">
                            +
                        </Button>
                    </span>
                </div>
                <div className="panel__field panel__field--centered">
                    <span className="panel__field-label">Normal</span>
                    <span className="panel__field-control" id="burn-normal" />
                    <span className="panel__dimension">m/s</span>
                    <span className="maneuver-panel__buttons">
                        <Button className="maneuver-panel__button" id="normal-zero">
                            0
                        </Button>
                        <Button className="maneuver-panel__button" id="normal-minus">
                            -
                        </Button>
                        <Button className="maneuver-panel__button" id="normal-plus">
                            +
                        </Button>
                    </span>
                </div>
                <div className="panel__field panel__field--centered">
                    <span className="panel__field-label">Radial</span>
                    <span className="panel__field-control" id="burn-radial" />
                    <span className="panel__dimension">m/s</span>
                    <span className="maneuver-panel__buttons">
                        <Button className="maneuver-panel__button" id="radial-zero">
                            0
                        </Button>
                        <Button className="maneuver-panel__button" id="radial-minus">
                            -
                        </Button>
                        <Button className="maneuver-panel__button" id="radial-plus">
                            +
                        </Button>
                    </span>
                </div>
                <div className="panel__field ">
                    <span className="panel__field-label">Total</span>
                    <span className="panel__field-control" id="burn-total" />
                    <span className="panel__dimension">m/s</span>
                </div>
            </div>
        </div>
    </Panel>
);

export default ManeuverPanel;
