import React from "react";
import Panel from "../../../../../common/panel";
import "./index.css";

function TimeSettingsPanel() {
    return (
        <Panel
            className="time-settings-panel"
            id="timePanel"
            data-panel-name="time"
            caption="Time"
        >
            <div className="time-settings-panel__content">
                <label className="panel__field time-settings-panel__field">
                    Current: <time id="currentDateValue">01.01.2000 12:00:00</time><button id="useCurrentTime">Now</button>
                </label>
                <label className="panel__field time-settings-panel__field">
                    Rate: <span id="timeScaleValue"/><button id="setRealTimeScale">Real</button>
                </label>
                <label className="panel__field time-settings-panel__field">
                    <input id="timeScaleSlider"
                           type="range"
                           className="time-settings-panel__scale-slider"
                           min="-1" max="1" step="0.001"
                           defaultValue={"0.001"}
                           style={{width: "100%"}}/>
                </label>
            </div>


            {/*<table className="panelContent" data-panel-name="time" style={{width: "100%"}}>*/}
                {/*<tbody>*/}
                {/*<tr>*/}
                    {/*<td style={{width: "65px"}}><b>Current:</b></td>*/}
                    {/*<td id="currentDateValue"></td>*/}
                    {/*<td style={{width: "70px"}}>*/}
                        {/*<button id="useCurrentTime">Now</button>*/}
                    {/*</td>*/}
                {/*</tr>*/}
                {/*<tr>*/}
                    {/*<td><b>Rate:</b></td>*/}
                    {/*<td id="timeScaleValue"/>*/}
                    {/*<td>*/}
                        {/*<button id="setRealTimeScale">Real</button>*/}
                    {/*</td>*/}
                {/*</tr>*/}
                {/*<tr>*/}
                    {/*<td colSpan="2">*/}
                        {/*<input id="timeScaleSlider" type="range" min="-1" max="1" step="0.001"*/}
                               {/*defaultValue={"0.001"}*/}
                               {/*style={{width: "100%"}}/>*/}
                    {/*</td>*/}
                    {/*<td/>*/}
                {/*</tr>*/}
                {/*</tbody>*/}
            {/*</table>*/}
        </Panel>
    );
}

export default TimeSettingsPanel;
