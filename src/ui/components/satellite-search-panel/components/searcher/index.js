import React from "react";
import PropTypes from "prop-types";

import ProgressButton from "../../../common/progress-button";

import "./index.scss";

class Searcher extends React.Component {
    static propTypes = {
        className: PropTypes.string.isRequired,
        onSearch: PropTypes.func.isRequired,
    };

    state = {
        noradId: "",
        launchDate: "",
    };

    get _isFilterValid() {
        return Boolean(this.state.noradId) || Boolean(this.state.launchDate); // TODO: Add a few more validation rules
    }

    _handleSatIdChange = ({ target: { value } }) => {
        this.setState({
            noradId: value,
        });
    };

    _handleLaunchDateChange = ({ target: { value } }) => {
        this.setState({
            launchDate: value,
        });
    };

    _handleSearch = () => {
        const { noradId, launchDate } = this.state;

        return this.props.onSearch({ noradId, launchDate });
    };

    render() {
        const { className } = this.props;
        const { noradId, launchDate } = this.state;

        return (
            <div className={`searcher ${className}`}>
                <div className="searcher__filter">
                    <div className="searcher__column">
                        <label>
                            Satellite Catalog Number
                            <input
                                className="searcher__input"
                                type="number"
                                value={noradId}
                                step={1}
                                placeholder="NORAD ID"
                                min="1"
                                onChange={this._handleSatIdChange}
                            />
                        </label>
                    </div>
                    <div className="searcher__column">
                        <label>
                            Launch date
                            <input
                                className="searcher__input"
                                type="text"
                                placeholder={"YYYY-MM-DD"}
                                value={launchDate}
                                onChange={this._handleLaunchDateChange}
                            />
                        </label>
                    </div>
                </div>
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
