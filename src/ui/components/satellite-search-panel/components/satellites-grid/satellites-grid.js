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
                        <th className="satellites-grid__pos-column">#</th>
                        <th className="satellites-grid__id-column">ID</th>
                        <th className="satellites-grid__name-column">Name</th>
                        <th className="satellites-grid__designator-column">Designator</th>
                        <th className="satellites-grid__launch-date-column">Launch date</th>
                        <th className="satellites-grid__command-column" />
                    </tr>
                </thead>
                <tbody>
                    {this.props.satellites.map((satellite, index) => {
                        const { noradId, name, launchDate, intlDes } = satellite;

                        return (
                            <tr key={noradId}>
                                <td>{index + 1}</td>
                                <td>{noradId}</td>
                                <td>{name}</td>
                                <td>{intlDes}</td>
                                <td>{launchDate}</td>
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
