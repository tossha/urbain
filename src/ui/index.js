import React from "react";
import ReactDOM from "react-dom";

import { RootContext, Store } from "./store";
import { createStatsBadge } from "./components/statistics-badge";
import { createServices } from "./services";
import AppComponent from "./app";

const statsBadge = createStatsBadge();
const webApiServices = createServices();

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
                    webApiServices,
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
