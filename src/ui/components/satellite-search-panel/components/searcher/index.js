import React from "react";
import PropTypes from "prop-types";

import ProgressButton from "../../../common/progress-button";
import Autocomplete from "../../../common/autocomplete/async";

import "./index.scss";

class Searcher extends React.Component {
    static propTypes = {
        className: PropTypes.string.isRequired,
        onSearch: PropTypes.func.isRequired,
        onSearchSatellitesByName: PropTypes.func.isRequired,
    };

    state = {
        name: "",
        noradId: "",
        launchDate: "",
    };

    get _isFilterValid() {
        return Boolean(this.state.noradId) || Boolean(this.state.launchDate) || Boolean(this.state.name); // TODO: Add a few more validation rules
    }

    _handleSearch = async () => {
        const { noradId, name, launchDate } = this.state;

        return this.props.onSearch({ noradId, name, launchDate });
    };

    _handleSearchSatellitesByName = token => {
        return this.props.onSearchSatellitesByName({ name: token });
    };

    _handleSatelliteSelect = ({ noradId, name, launchDate }) => {
        this.setState({ name /* noradId,  launchDate */ });
    };

    _handleSatelliteNameChange = name => {
        this.setState({ name });
    };

    _renderOption = satellite => (
        <div className="satellite-option">
            <span className="satellite-option__norad-id">{satellite.noradId}</span>
            <span className="satellite-option__name">{satellite.name}</span>
            <span className="satellite-option__launch-date">{satellite.launchDate}</span>
        </div>
    );

    render() {
        const { className } = this.props;

        return (
            <div className={`searcher ${className}`}>
                <label className="searcher__autocomplete">
                    <Autocomplete
                        className="searcher__input"
                        placeholder="Start typing satellite name ..."
                        onFetchOptions={this._handleSearchSatellitesByName}
                        mapValue={satellite => satellite.name}
                        renderOption={this._renderOption}
                        onSelect={this._handleSatelliteSelect}
                        onChange={this._handleSatelliteNameChange}
                    />
                </label>
                <div className="searcher__search-button-wrapper">
                    <ProgressButton
                        className="searcher__search-button"
                        disabled={!this._isFilterValid}
                        onClick={this._handleSearch}
                    >
                        search
                    </ProgressButton>
                </div>
            </div>
        );
    }
}

export default Searcher;
