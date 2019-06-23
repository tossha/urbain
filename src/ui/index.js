import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";

import { createStores, AppStore } from "./stores";
import AppComponent from "./components/app";

/**
 * @param {AppModel} appModel
 */
function renderUi(appModel) {
    const stores = createStores(appModel);

    ReactDOM.render(
        <Provider {...stores}>
            <AppComponent />
        </Provider>,
        document.getElementById("root"),
    );
}

export { renderUi, AppStore };
