import React from "react";

export function MetricsPanel() {
    return <div id="metricsPanel" className="panel" data-panel-name="metrics">
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
                <td id="metricsOf"/>
            </tr>
            <tr>
                <td><b>relative to</b></td>
                <td id="relativeTo"/>
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
                    <input type="checkbox" id="showAnglesOfSelectedOrbit" defaultChecked/>
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
                <td id="elements-orbit-alt" align="right"/>
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
    </div>;
}
