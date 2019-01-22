import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import Autosuggest from "react-autosuggest";
import uniqueId from "lodash.uniqueid";

import "./index.scss";

class BaseAutocomplete extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        placeholder: PropTypes.string,
        defaultValue: PropTypes.string,
        mapValue: PropTypes.func,
        renderOption: PropTypes.func,
        onFetchOptions: PropTypes.func.isRequired,
        onClearSuggestions: PropTypes.func,
        onChange: PropTypes.func,
        onSelect: PropTypes.func,
        onSubmit: PropTypes.func,
    };

    static defaultProps = {
        onFetchOptions() {},
        onClearSuggestions() {},
        onChange() {},
        onSubmit() {},
        mapValue: value => value,
        renderOption: value => value,
        defaultValue: "",
    };

    state = {
        value: this.props.defaultValue,
        options: [],
        isLoading: false,
    };

    id = uniqueId();

    _handleChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        });

        this.props.onChange(newValue);
    };

    _handleKeyUp = event => {
        const { key } = event;

        if (key === "Enter") {
            this.props.onSubmit();
        }
    };

    _handleSuggestionsFetchRequested = async ({ value }) => {
        this.setState({
            isLoading: true,
        });

        const options = await this.props.onFetchOptions(value);

        this.setState({
            isLoading: false,
            options: options || [],
        });

        return options;
    };

    _handleSuggestionsClearRequested = () => {
        this.setState(
            {
                options: [],
            },
            () => {
                this.props.onClearSuggestions();
            },
        );
    };

    _handleSelect = (event, { suggestion }) => {
        this.props.onSelect(suggestion);
    };

    render() {
        const { className, placeholder, renderOption, mapValue } = this.props;
        const { value, options, isLoading } = this.state;

        const inputProps = {
            placeholder,
            value,
            onChange: this._handleChange,
            onKeyUp: this._handleKeyUp,
        };

        return (
            <div className={cn(className, { [`${className}--loading`]: isLoading })}>
                <Autosuggest
                    suggestions={options}
                    onSuggestionsFetchRequested={this._handleSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this._handleSuggestionsClearRequested}
                    onSuggestionSelected={this._handleSelect}
                    getSuggestionValue={mapValue}
                    renderSuggestion={renderOption}
                    inputProps={inputProps}
                    id={this.id}
                />
            </div>
        );
    }
}

export default BaseAutocomplete;
