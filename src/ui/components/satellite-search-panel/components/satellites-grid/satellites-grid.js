import React from "react";
import PropTypes from "prop-types";

import Satellite from "../../../../services/satellite-finder/satelite";
import ActionButton from "../action-button";
import "./satellites-grid.scss";

class SatellitesGrid extends React.Component {
    static propTypes = {
        satellites: PropTypes.arrayOf(PropTypes.instanceOf(Satellite)).isRequired,
        onSatelliteLoad: PropTypes.func.isRequired,
        onSatelliteUnload: PropTypes.func.isRequired,
    };

    render() {
        return (
            <table className="satellites-grid">
                <thead className="satellites-grid__head">
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Launch date</th>
                        <th>Designator</th>
                        <th>Decay date</th>
                        <th className="satellites-grid__command-column" />
                    </tr>
                </thead>
                <tbody>
                    {this.props.satellites.map((satellite, index) => {
                        const { noradId, name, launchDate, intlDes, decayDate } = satellite;

                        return (
                            <tr key={noradId}>
                                <td>{index + 1}</td>
                                <td>{noradId}</td>
                                <td>{name}</td>
                                <td>{launchDate}</td>
                                <td>{intlDes}</td>
                                <td>{decayDate === "0000-00-00" ? "-" : decayDate}</td>
                                <td className="satellites-grid__command-column">
                                    <ActionButton
                                        className="satellites-grid__action-button"
                                        satelliteId={noradId}
                                        onLoad={this.props.onSatelliteLoad}
                                        onUnload={this.props.onSatelliteUnload}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

export default SatellitesGrid;
