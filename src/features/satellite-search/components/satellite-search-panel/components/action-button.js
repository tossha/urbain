import React, { Component } from "react";
import PropTypes from "prop-types";

import ProgressButton from "../../../../../ui/components/common/progress-button";

class ActionButton extends Component {
    static propTypes = {
        className: PropTypes.string,
        onLoad: PropTypes.func.isRequired,
        onUnload: PropTypes.func.isRequired,
        satelliteId: PropTypes.string.isRequired,
    };

    static defaultProps = {
        className: "",
    };

    state = {
        isSatelliteLoaded: false,
    };

    _handleClick = () => {
        return this.state.isSatelliteLoaded
            ? this.props.onUnload(this.props.satelliteId).then(data => {
                  this.setState({ isSatelliteLoaded: false });

                  return data;
              })
            : this.props.onLoad(this.props.satelliteId).then(data => {
                  this.setState({ isSatelliteLoaded: true });

                  return data;
              });
    };

    render() {
        const label = this.state.isSatelliteLoaded ? "Unload" : "Load";

        return (
            <ProgressButton className={this.props.className} onClick={this._handleClick}>
                {label}
            </ProgressButton>
        );
    }
}

export default ActionButton;
