import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";

import { createStores, AppStore } from "./stores";
import AppComponent from "./components/app";

/**
 * @param {AppModel} appModel
 * @param {SimulationModel} simulationModel
 * @param {string} viewportId
 */
function renderUi(appModel, simulationModel, viewportId) {
    const stores = createStores(appModel, simulationModel);

    ReactDOM.render(
        <Provider {...stores}>
            <AppComponent viewportId={viewportId} />
        </Provider>,
        document.getElementById("root"),
    );
}

export { renderUi, AppStore };
