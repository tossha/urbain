import React from "react";
import PropTypes from "prop-types";

import ProgressButton from "../../../common/progress-button";
import { AsyncAutocomplete } from "../../../common/autocomplete";
import { ReactComponent as SearchLogo } from "../../../common/images/search.svg";

import "./index.scss";

class Searcher extends React.Component {
    static propTypes = {
        className: PropTypes.string.isRequired,
        onSearch: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired,
        onSource: PropTypes.func.isRequired,
        renderOption: PropTypes.func,
        placeholder: PropTypes.string,
    };

    static defaultTypes = {
        placeholder: "",
        renderOption: option => option,
    };

    state = {
        query: "",
    };

    get query() {
        return this.state.query.trim();
    }

    _handleSelect = option => {
        return this.props.onSelect(option);
    };

    _handleSearch = () => {
        return this.props.onSearch(this.query);
    };

    _handleSource = query => {
        return this.props.onSource(query);
    };

    _handleTyping = query => {
        this.setState({ query });
    };

    render() {
        const { className, placeholder, renderOption } = this.props;

        return (
            <div className={`searcher ${className}`}>
                <div className="searcher__autocomplete">
                    <SearchLogo className="searcher__autocomplete-search-logo" />
                    <AsyncAutocomplete
                        className="searcher__autocomplete-input"
                        placeholder={placeholder}
                        onFetchOptions={this._handleSource}
                        mapValue={satellite => satellite.name}
                        renderOption={renderOption}
                        onSelect={this._handleSelect}
                        onChange={this._handleTyping}
                        onSubmit={this._handleSearch}
                    />
                </div>
                <ProgressButton
                    className="searcher__search-button"
                    disabled={!Boolean(this.query)}
                    onClick={this._handleSearch}
                >
                    search
                </ProgressButton>
            </div>
        );
    }
}

export default Searcher;
