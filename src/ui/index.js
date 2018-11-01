import React from "react";
import ReactDOM from "react-dom";

import { configureLibs } from "./libs";
import { Provider, Store } from "./store";
import { createStatsBadge } from "./components/statistics-badge";
import AppComponent from "./app";

configureLibs();
const statsBadge = createStatsBadge();

class Root extends React.Component {
    state = {
        stats: statsBadge,
        store: this.props.store,
        updateStore: updatedStore => {
            this.setState({
                store: updatedStore,
            });
        },
    };

    render() {
        return (
            <Provider value={this.state}>
                <AppComponent />
            </Provider>
        );
    }
}

function renderUi(initialState) {
    ReactDOM.render(<Root store={initialState} />, document.getElementById("root"));
}

export { renderUi, statsBadge, Store };
