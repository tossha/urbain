import { init } from "../core";
import { loadTLE, loadKSP } from "../api";
import { renderUi, VIEWPORT_ENTRY_ID } from "../ui";
import { AppModel } from "./models/app";
import { createServices } from "./services";

class Application {
    /**
     * @param {Simulation} sim
     */
    constructor(sim) {
        const services = createServices();
        this._appModel = new AppModel(sim, loadTLE, services);
    }

    init() {
        init(this._appModel, VIEWPORT_ENTRY_ID);
    }

    /**
     * @return {AppModel}
     */
    get appModel() {
        return this._appModel;
    }

    getApi() {
        return {
            loadTLE,
            loadKSP,
        };
    }

    renderUi() {
        renderUi(this._appModel);
    }
}

export default Application;
