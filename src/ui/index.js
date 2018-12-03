import React from "react";
import ReactDOM from "react-dom";

import { configureLibs } from "./libs";
import { RootContext, Store } from "./store";
import { createStatsBadge } from "./components/statistics-badge";
import SatelliteFinder from "./services/satellite-finder";
import AppComponent from "./app";

configureLibs();
const statsBadge = createStatsBadge();

class Root extends React.Component {
    state = {
        store: this.props.store,
    };

    _handleUpdateStore = updatedStore => {
        this.setState({
            store: updatedStore,
        });
    };

    render() {
        const { store } = this.state;

        return (
            <RootContext.Provider
                value={{
                    store,
                    stats: statsBadge,
                    updateStore: this._handleUpdateStore,
                    webApiServices: {
                        satelliteFinder: new SatelliteFinder("/api"),
                    },
                }}
            >
                <AppComponent />
            </RootContext.Provider>
        );
    }
}

function renderUi(initialState) {
    ReactDOM.render(<Root store={initialState} />, document.getElementById("root"));
}

export { renderUi, statsBadge, Store };
