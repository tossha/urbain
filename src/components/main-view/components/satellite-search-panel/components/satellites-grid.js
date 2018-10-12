import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "../../../../common/button";
import Satellite from "../satelite";

class LoadButton extends Component {
    static propTypes = {
        onLoad: PropTypes.func.isRequired,
        satelliteId: PropTypes.string.isRequired,
    };

    handleLoad = () => {
        this.props.onLoad(this.props.satelliteId);
    };

    render() {
        return <Button text="Load" onClick={this.handleLoad} />;
    }
}

class SatellitesGrid extends React.Component {
    static propTypes = {
        satellites: PropTypes.arrayOf(PropTypes.instanceOf(Satellite)).isRequired,
        onSatelliteLoad: PropTypes.func.isRequired,
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
                                <td>{index}</td>
                                <td>{noradId}</td>
                                <td>{name}</td>
                                <td>{intlDes}</td>
                                <td>{launchDate}</td>
                                <td>
                                    <LoadButton satelliteId={noradId} onLoad={this.props.onSatelliteLoad} />
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
