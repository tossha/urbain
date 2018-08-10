import React from "react";
import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExpand, faPlay, faPause, faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Provider, store } from "./store";
import { init } from "./main";

import AppComponent from "./components/app";

library.add(faExpand);
library.add(faPlay);
library.add(faPause);
library.add(faChevronDown);
library.add(faCheck);

init();

class App extends React.Component {
    state = {
        store: this.props.store,
        dispatch: updatedStore => {
            this.setState(prevSate => ({
                store: { ...prevSate.store, ...updatedStore },
            }));
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

ReactDOM.render(<App store={store} />, document.getElementById("root"));
