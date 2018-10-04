import React from "react";
import ReactDOM from "react-dom";

import { configureLibs } from "./libs";
import { Provider } from "./store";
import { sim } from "./core/index";
import { createStatsBadge } from "./components/main-view/components/statistics-badge/index";
import AppComponent from "./components/app";
import Application from "./application";

configureLibs();

const statsBadge = createStatsBadge();
const app = new Application(sim);
const initialState = app.getInitialState();
window.api = app.getApi();

class App extends React.Component {
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

ReactDOM.render(<App store={initialState} />, document.getElementById("root"));

app.init(statsBadge);