import React from "react";

export function LambertPanel() {
    return <div className="panel" id="lambertPanel" data-panel-name="lambert">
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
               style={{width: "100%", borderBottom: "blue solid 1px"}}>
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
    </div>;
}
