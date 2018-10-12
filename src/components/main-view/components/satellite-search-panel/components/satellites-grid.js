import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "../../../../common/button";
import Satellite from "../satelite";

class LoadButton extends Component {
    static propTypes = {
        onLoad: PropTypes.func.isRequired,
        onUnload: PropTypes.func.isRequired,
        satelliteId: PropTypes.string.isRequired,
    };

    state = {
        isLoaded: false
    };

    handleLoad = () => {
        this.props.onLoad(this.props.satelliteId);
        this.setState({isLoaded: true});
    };

    handleUnload = () => {
        this.props.onUnload(this.props.satelliteId);
        this.setState({isLoaded: false});
    };

    render() {
        return this.state.isLoaded
            ? <Button text="Unload" onClick={this.handleUnload} />
            : <Button text="Load" onClick={this.handleLoad} />;
    }
}

class SatellitesGrid extends React.Component {
    static propTypes = {
        satellites: PropTypes.arrayOf(PropTypes.instanceOf(Satellite)).isRequired,
        onSatelliteLoad: PropTypes.func.isRequired,
        onSatelliteUnload: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className="satellites-grid-container">
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
                                    <LoadButton satelliteId={noradId} onLoad={this.props.onSatelliteLoad} onUnload={this.props.onSatelliteUnload} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
        );
    }
}

export default SatellitesGrid;
