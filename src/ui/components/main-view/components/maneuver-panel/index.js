import React from "react";

import Panel, { Field, FieldSet, FieldLabel, FieldControl, Dimension } from "../../../common/panel";
import Button from "../../../common/button";
import "./index.scss";

const ManeuverPanel = ({ className }) => (
    <Panel id="maneuverPanel" className={`maneuver-panel ${className}`} caption="Maneuver" collapseDirection="left">
        <div className="maneuver-panel__content">
            <FieldSet>
                <Field centered>
                    <Button className="maneuver-panel__button" id="prev-burn">
                        Prev burn
                    </Button>
                    <FieldLabel id="burn-name" />
                    <Button className="maneuver-panel__button" id="next-burn">
                        Next burn
                    </Button>
                </Field>
            </FieldSet>
            <FieldSet>
                <Field className="panel__field-header">Increment</Field>
                <Field centered>
                    <FieldLabel small id="increment" />
                    <FieldControl className="maneuver-panel__buttons">
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
                    </FieldControl>
                </Field>
            </FieldSet>

            <FieldSet>
                <Field className="panel__field-header">Time</Field>
                <Field>
                    <FieldLabel>Date</FieldLabel>
                    <FieldControl id="burn-date" />
                </Field>
                <Field centered>
                    <FieldLabel>Epoch</FieldLabel>
                    <FieldControl id="burn-epoch" />
                    <span className="maneuver-panel__buttons">
                        <Button className="maneuver-panel__button" id="epoch-minus">
                            -
                        </Button>
                        <Button className="maneuver-panel__button" id="epoch-plus">
                            +
                        </Button>
                    </span>
                </Field>
            </FieldSet>

            <FieldSet>
                <Field className="panel__field-header">Impulse</Field>
                <Field centered>
                    <FieldLabel>Prograde</FieldLabel>
                    <FieldControl id="burn-prograde" />
                    <Dimension>m/s</Dimension>
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
                </Field>
                <Field centered>
                    <FieldLabel>Normal</FieldLabel>
                    <FieldControl id="burn-normal" />
                    <Dimension>m/s</Dimension>
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
                </Field>
                <Field centered>
                    <FieldLabel>Radial</FieldLabel>
                    <FieldControl id="burn-radial" />
                    <Dimension>m/s</Dimension>
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
                </Field>
                <Field>
                    <FieldLabel>Total</FieldLabel>
                    <FieldControl id="burn-total" />
                    <Dimension>m/s</Dimension>
                </Field>
            </FieldSet>
        </div>
    </Panel>
);

export default ManeuverPanel;
