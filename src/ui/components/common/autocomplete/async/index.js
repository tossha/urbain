import React from "react";
import throttle from "lodash.throttle";

import BaseAutocomplete from "../base";

function withThrottledFetchingOptions(Component) {
    return class AsyncAutocomplete extends React.Component {
        _handleFetchOptions = throttle(value => this.props.onFetchOptions(value), 150);

        render() {
            const { onFetchOptions, ...props } = this.props;

            return <Component {...props} onFetchOptions={this._handleFetchOptions} />;
        }
    };
}

export default withThrottledFetchingOptions(BaseAutocomplete);
