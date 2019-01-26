import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";

import AppComponent from "./app";
import { AppStore } from "./store";
import { VIEWPORT_ENTRY_ID } from "./constants";

/**
 * @param {AppModel} appModel
 */
function renderUi(appModel) {
    const appStore = new AppStore(appModel);

    ReactDOM.render(
        <Provider appStore={appStore}>
            <AppComponent />
        </Provider>,
        document.getElementById("root"),
    );
}

export { renderUi, AppStore, VIEWPORT_ENTRY_ID };
