import React from "react";

export function CreationPanel() {
    return <div className="panel" id="creationPanel" data-panel-name="creation">
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
    </div>;
}
