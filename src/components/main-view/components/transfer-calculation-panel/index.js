import React from "react";
import cn from "classnames";

import { Consumer } from "../../../../store";
import Panel from "../../../common/panel";
import Button from "../../../common/button";
import "./index.scss";

const TransferCalculationPanel = ({ className }) => (
    <Consumer>
        {({ store }) => (
            <Panel
                className={cn(className, "transfer-calculation-panel")}
                id="lambertPanel"
                caption="Transfer calculation"
                hidden={!store.viewSettings.showTransferCalculationPanel}
            >
                <div className="panel__field-set">
                    <div className="panel__field">
                        <span className="panel__field-label">Origin</span>
                        <select className="panel__field-control transfer-calculation-panel__select" id="originSelect" />
                    </div>
                    <div className="panel__field">
                        <span className="panel__field-label">Target</span>
                        <select className="panel__field-control transfer-calculation-panel__select" id="targetSelect" />
                    </div>
                    <div className="panel__field">
                        <span className="panel__field-label">Transfer type</span>
                        <span className="panel__field-control">Ballistic</span>
                    </div>
                    <div className="panel__field">
                        <span className="panel__field-label">Departure</span>
                        <time className="panel__field-control" id="departureDateValue">
                            01.01.2000 12:00:00
                        </time>
                        <Button className="panel__button" id="useCurrentTime">
                            Now
                        </Button>
                    </div>
                    <div className="panel__field">
                        <span className="panel__field-label">Transfer time:</span>
                        <span className="panel__field-control" id="transferTimeValue" />
                        {/*<Button className="panel__button" id="optimalTransferTime">*/}
                        {/*Optimal*/}
                        {/*</button>*/}
                    </div>
                    <div className="panel__field">
                        <input
                            id="transferTimeSlider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.001"
                            defaultValue={"0.5"}
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>
                <div className="transfer-calculation-panel__delta-v-calc panel__field-set" data-panel-name="lambert">
                    <div className="panel__field panel__field-header">Delta-V</div>
                    <div className="panel__field">
                        <span className="panel__field-label">Ejection:</span>
                        <span className="panel__field-control" id="deltaVEjection">
                            0
                        </span>
                        <span className="panel__dimension">km/s</span>
                    </div>
                    <div className="panel__field">
                        <span className="panel__field-label">Insertion:</span>
                        <span className="panel__field-control" id="deltaVInsertion">
                            0
                        </span>
                        <span className="panel__dimension">km/s</span>
                    </div>
                    <div className="panel__field">
                        <span className="panel__field-label">Total:</span>
                        <span className="panel__field-control" id="deltaVTotal">
                            0
                        </span>
                        <span className="panel__dimension">km/s</span>
                    </div>
                </div>
            </Panel>
        )}
    </Consumer>
);

export default TransferCalculationPanel;
