import { init as initSimulationEngine } from "../core";
import { renderUi } from "../ui";
import { createServices } from "./services";
import { AppModel } from "./models/app-model";

const VIEWPORT_ENTRY_ID = "viewport-id";

class Application {
    constructor() {
        const services = createServices();
        this._appModel = new AppModel(services, VIEWPORT_ENTRY_ID);
    }

    renderUi() {
        renderUi(this._appModel, this._simulationModel, this._simulationModel.viewportId);
    }

    initSimulation() {
        initSimulationEngine(this._simulationModel);
    }

    getApi() {
        return {
            loadTLE: noradId => this._simulationModel.loadTLE(noradId),
            loadKSP: () => this._simulationModel.loadKSP(),
        };
    }

    /**
     * @return {SimulationModel}
     * @private
     */
    get _simulationModel() {
        return this._appModel.simulationModel;
    }
}

export default Application;
export { VisualObject } from "./entities/visual-object";
