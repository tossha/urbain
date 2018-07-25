import React from "react";

import Header from "./header";
import Footer from "./footer";

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Header/>
                <main>
                    <div id="leftPanel" />
                    <div id="viewport" />
                    <div id="metricsPanel" className="panel" data-panel-name="metrics">
                        <table id="metricsHeader" className="panelHeader">
                            <tbody>
                                <tr>
                                    <td>
                                        Metrics
                                        <button className="collapseButton" data-panel-name="metrics"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table style={{borderBottom: "blue solid 1px"}}
                               width="100%"
                               className="panelContent"
                               data-panel-name="metrics">
                            <tbody>
                                <tr>
                                    <td style={{width: "110px"}}><b>of</b></td>
                                    <td id="metricsOf" />
                                </tr>
                                <tr>
                                    <td><b>relative to</b></td>
                                    <td id="relativeTo" />
                                </tr>
                            </tbody>
                        </table>

                        <table style={{borderBottom: "blue solid 1px"}}
                               width="100%"
                               className="panelContent"
                               data-panel-name="metrics">
                            <tbody>
                                <tr>
                                    <td>
                                        <label htmlFor="showAnglesOfSelectedOrbit">Visualize angles</label>
                                    </td>
                                    <td>
                                        <input type="checkbox" id="showAnglesOfSelectedOrbit" defaultChecked />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        &nbsp;
                                    </td>
                                    <td>
                                        <button type="button" id="unloadObject">Unload object</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table style={{borderBottom: "blue solid 1px"}}
                               width="100%"
                               className="panelContent"
                               data-panel-name="metrics">
                            <tbody>
                                <tr>
                                    <td colSpan="3">
                                        Main
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>Orbit</td>
                                    <td id="elements-orbit-alt" align="right" />
                                    <td style={{width: "60px"}}>km</td>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>Avg height</td>
                                    <td id="elements-orbit-avg" align="right"/>
                                    <td style={{width: "60px"}}>km</td>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>Altitude</td>
                                    <td id="elements-alt" align="right"/>
                                    <td style={{width: "60px"}}>km</td>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>Speed</td>
                                    <td id="elements-speed" align="right"/>
                                    <td style={{width: "60px"}}>m/s</td>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>Precession</td>
                                    <td id="elements-precession" align="right"/>
                                    <td style={{width: "60px"}}>deg/day</td>
                                </tr>
                                <tr id="row-node-time" style={{display: "none"}}>
                                    <td style={{width: "60px"}}>Node local time</td>
                                    <td id="elements-node-time" align="right"/>
                                    <td style={{width: "60px"}}/>
                                </tr>
                            </tbody>
                        </table>

                        <table style={{borderBottom: "blue solid 1px"}}
                               width="100%"
                               className="panelContent"
                               data-panel-name="metrics">
                            <tbody>
                                <tr>
                                    <td colSpan="3">
                                        Keplerian
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>Ecc</td>
                                    <td id="elements-ecc" align="right"/>
                                    <td style={{width: "60px"}}/>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>SMA</td>
                                    <td id="elements-sma" align="right"/>
                                    <td style={{width: "60px"}}>km</td>
                                </tr>

                                <tr>
                                    <td style={{width: "60px"}}>Inc</td>
                                    <td id="elements-inc" align="right"/>
                                    <td style={{width: "60px"}}>deg.</td>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>AoP</td>
                                    <td id="elements-aop" align="right"/>
                                    <td style={{width: "60px"}}>deg.</td>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>RAAN</td>
                                    <td id="elements-raan" align="right"/>
                                    <td style={{width: "60px"}}>deg.</td>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>TA</td>
                                    <td id="elements-ta" align="right"/>
                                    <td style={{width: "60px"}}>deg.</td>
                                </tr>
                                <tr>
                                    <td style={{width: "60px"}}>Period</td>
                                    <td id="elements-period" align="right"/>
                                    <td style={{width: "60px"}}>days</td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="panelContent" data-panel-name="metrics">
                            <tbody>
                                <tr>
                                    <td colSpan="6">Cartesian</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="panelContent" data-panel-name="metrics">
                            <table data-panel-name="position_vector" width="100%">
                                <tbody>
                                    <tr>
                                        <td style={{width: "65px"}}>Position</td>
                                        <td className="vec-magnitude" align="right"/>
                                        <td style={{width: "60px"}}>km</td>
                                        <td style={{width: "49px"}}>
                                            <button className="collapseButton" data-panel-name="position_vector"/>
                                        </td>
                                    </tr>
                                    <tr className="panelContent" data-panel-name="position_vector">
                                        <td>x</td>
                                        <td className="vec-x" align="right"/>
                                        <td>km</td>
                                    </tr>
                                    <tr className="panelContent" data-panel-name="position_vector">
                                        <td>y</td>
                                        <td className="vec-y" align="right"/>
                                        <td>km</td>
                                    </tr>
                                    <tr className="panelContent" data-panel-name="position_vector">
                                        <td>z</td>
                                        <td className="vec-z" align="right"/>
                                        <td>km</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="panelContent" data-panel-name="metrics">
                            <table data-panel-name="velocity_vector" width="100%">
                                <tbody>
                                    <tr>
                                        <td style={{width: "65px"}}>Velocity</td>
                                        <td className="vec-magnitude" align="right"/>
                                        <td style={{width: "60px"}}>km/s</td>
                                        <td style={{width: "49px"}}>
                                            <button className="collapseButton" data-panel-name="velocity_vector"/>
                                        </td>
                                    </tr>
                                    <tr className="panelContent" data-panel-name="velocity_vector">
                                        <td>x</td>
                                        <td className="vec-x" align="right"/>
                                        <td>km/s</td>
                                    </tr>
                                    <tr className="panelContent" data-panel-name="velocity_vector">
                                        <td>y</td>
                                        <td className="vec-y" align="right"/>
                                        <td>km/s</td>
                                    </tr>
                                    <tr className="panelContent" data-panel-name="velocity_vector">
                                        <td>z</td>
                                        <td className="vec-z" align="right"/>
                                        <td>km/s</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div id="bottomPanel">
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
                                                   style={{width: "100%"}} />
                                        </td>
                                        <td>
                                            <button id="pauseButton" tabIndex="-1">Pause</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="panel" id="cameraPanel" data-panel-name="camera">
                            <table id="cameraBoxHeader" className="panelHeader">
                                <tbody>
                                    <tr>
                                        <td>
                                            Camera
                                            <button className="collapseButton" data-panel-name="camera"/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="panelContent" data-panel-name="camera">
                                <tbody>
                                    <tr>
                                        <td><b>Target:</b></td>
                                        <td colSpan="2">
                                            <select id="targetSelect">
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Frame type:</b></td>
                                        <td colSpan="2">
                                            <select id="rfTypeSelect">
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <canvas id="timeLineCanvas"/>
                    </div>
                    <div className="panel" id="creationPanel" data-panel-name="creation">
                        <table id="creationHeader" className="panelHeader">
                            <tbody>
                                <tr>
                                    <td>
                                        Orbit creation
                                        <button className="collapseButton" data-panel-name="creation"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="panelContent" data-panel-name="creation">
                            <tbody>
                                <tr>
                                    <td>
                                        <button id="createOrbit">Create</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel" id="lambertPanel" data-panel-name="lambert">
                        <table id="lambertHeader" className="panelHeader">
                            <tbody>
                                <tr>
                                    <td>
                                        Transfer calculation
                                        <button className="collapseButton" data-panel-name="lambert"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="panelContent" data-panel-name="lambert" width="100%"
                               style={{borderBottom: "blue solid 1px"}}>
                            <tbody>
                                <tr>
                                    <td><b>Origin:</b></td>
                                    <td>
                                        <select id="originSelect"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Target:</b></td>
                                    <td>
                                        <select id="targetSelect"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Transfer type:</b></td>
                                    <td>
                                        Ballistic
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="panelContent" data-panel-name="lambert"
                               style={{ width: "100%", borderBottom: "blue solid 1px"}}>
                            <tbody>
                                <tr>
                                    <td><b>Departure:</b></td>
                                    <td id="departureDateValue">01.01.2000 12:00:00</td>
                                    <td>
                                        <button id="useCurrentTime">Now</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Transfer time:</b></td>
                                    <td id="transferTimeValue"/>
                                    <td>
                                        {/*<button id="optimalTransferTime">Optimal</button>*/}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="3">
                                        <input id="transferTimeSlider"
                                               type="range"
                                               min="0" max="1"
                                               step="0.001"
                                               defaultValue={"0.5"}
                                               style={{width: "100%"}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="panelContent" data-panel-name="lambert">
                            <tbody>
                                <tr>
                                    <td><b>Ejection Delta-V:</b></td>
                                    <td id="deltaVEjection"/>
                                </tr>
                                <tr>
                                    <td><b>Insertion Delta-V:</b></td>
                                    <td id="deltaVInsertion"/>
                                </tr>
                                <tr>
                                    <td><b>Total Delta-V:</b></td>
                                    <td id="deltaVTotal"/>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
                <Footer/>
            </React.Fragment>
        )
    }
}

export default App;
