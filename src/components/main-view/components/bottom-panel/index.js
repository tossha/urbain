import React from "react";
import cn from "classnames";
import "./index.css";
import CameraPanel from "./camera-panel";
import { TimeLine } from "./time-line";

function BottomPanel({ className }) {
    return (
        <div className={cn(className, "bottom-panel")}>
            <div className="bottom-panel__time-panel">
                <div className="panel" id="timePanel" data-panel-name="time">
                    <table id="timeBoxHeader" className="panelHeader">
                        <tbody>
                        <tr>
                            <td>
                                Time
                                <button className="collapseButton" data-panel-name="time"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <table className="panelContent" data-panel-name="time" style={{width: "100%"}}>
                        <tbody>
                        <tr>
                            <td style={{width: "65px"}}><b>Current:</b></td>
                            <td id="currentDateValue">01.01.2000 12:00:00</td>
                            <td style={{width: "70px"}}>
                                <button id="useCurrentTime">Now</button>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Rate:</b></td>
                            <td id="timeScaleValue"/>
                            <td>
                                <button id="setRealTimeScale">Real</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <input id="timeScaleSlider" type="range" min="-1" max="1" step="0.001"
                                       defaultValue={"0.001"}
                                       style={{width: "100%"}}/>
                            </td>
                            <td>

                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bottom-panel__pause-button-container">
                <button type="button" id="pauseButton">Pause</button>
            </div>
            <div className="bottom-panel__time-line-container">
                <TimeLine/>
            </div>
            <div className="bottom-panel__camera-panel">
                <CameraPanel />
            </div>

        </div>
    );
}

export default BottomPanel;
