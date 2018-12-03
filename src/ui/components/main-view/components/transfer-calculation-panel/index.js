import React from "react";
import cn from "classnames";

import { RootContext } from "../../../../store";
import Panel, { Field, FieldSet, FieldLabel, FieldControl, PanelButton, Dimension } from "../../../common/panel";
import "./index.scss";

const TransferCalculationPanel = ({ className }) => (
    <RootContext.Consumer>
        {({ store }) => (
            <Panel
                className={cn(className, "transfer-calculation-panel")}
                id="lambertPanel"
                caption="Transfer calculation"
                hidden={!store.viewSettings.showTransferCalculationPanel}
            >
                <FieldSet>
                    <Field>
                        <FieldLabel>Origin</FieldLabel>
                        <FieldControl>
                            <select className="transfer-calculation-panel__select" id="originSelect" />
                        </FieldControl>
                    </Field>
                    <Field>
                        <FieldLabel>Target</FieldLabel>
                        <FieldControl>
                            <select className="transfer-calculation-panel__select" id="targetSelect" />
                        </FieldControl>
                    </Field>
                    <Field>
                        <FieldLabel>Transfer type</FieldLabel>
                        <FieldControl>Ballistic</FieldControl>
                    </Field>
                    <Field>
                        <FieldLabel>Departure</FieldLabel>
                        <FieldControl>
                            <time id="departureDateValue">01.01.2000 12:00:00</time>
                        </FieldControl>
                        <PanelButton id="useCurrentTime">Now</PanelButton>
                    </Field>
                    <Field>
                        <FieldLabel>Transfer time</FieldLabel>
                        <FieldControl id="transferTimeValue" />
                        {/*<PanelButton id="optimalTransferTime">*/}
                        {/*Optimal*/}
                        {/*</PanelButton>*/}
                    </Field>
                    <Field>
                        <FieldControl fullSize>
                            <input
                                id="transferTimeSlider"
                                type="range"
                                min="0"
                                max="1"
                                step="0.001"
                                defaultValue={"0.5"}
                                style={{ width: "100%" }}
                            />
                        </FieldControl>
                    </Field>
                </FieldSet>
                <FieldSet className="transfer-calculation-panel__delta-v-calc " data-panel-name="lambert">
                    <Field className="panel__field-header">Delta-V</Field>
                    <Field>
                        <FieldLabel>Ejection</FieldLabel>
                        <FieldControl id="deltaVEjection">0</FieldControl>
                        <Dimension>km/s</Dimension>
                    </Field>
                    <Field>
                        <FieldLabel>Insertion</FieldLabel>
                        <FieldControl id="deltaVInsertion">0</FieldControl>
                        <Dimension>km/s</Dimension>
                    </Field>
                    <Field>
                        <FieldLabel>Total</FieldLabel>
                        <FieldControl id="deltaVTotal">0</FieldControl>
                        <Dimension>km/s</Dimension>
                    </Field>
                </FieldSet>
            </Panel>
        )}
    </RootContext.Consumer>
);

TransferCalculationPanel.contextType = RootContext;

export default TransferCalculationPanel;
