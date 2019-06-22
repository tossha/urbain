import { observable, runInAction } from "mobx";
import { renderUi } from "../ui";
import { createServices } from "./services";
import { AppModel } from "./models/app-model";
import { StarSystem } from "../constants/star-system";
import { createSimulationEngine, sim } from "../core/Simulation";
import ShortcutManager from "./shortcut-manager";

const VIEWPORT_ENTRY_ID = "viewport-id";
const services = createServices();

class Application {
    /**
     * @type {Universe}
     */
    @observable
    activeUniverse = null;

    async loadDefaultUniverse() {
        const universe = await services.universeService.getDefaultUniverse();
        const appModel = new AppModel(VIEWPORT_ENTRY_ID, universe);
        const simulationModel = appModel.simulationModel;

        createSimulationEngine(simulationModel);

        this._appModel = appModel;
        this._simulationEngine = sim;
        this._shortcutManager = new ShortcutManager();

        this._selectUniverse(universe);
    }

    renderUi() {
        renderUi(this._appModel, this._simulationModel, this._simulationModel.viewportId);
    }

    renderSimulation() {
        this._simulationEngine.startRenderLoop();
        this._simulationModel.runTime();
    }

    getApi() {
        return {
            loadTLE: noradId => this._appModel.loadTLE(noradId),
            loadKSP: () => {
                if (this.activeUniverse) {
                    return this.activeUniverse.moduleManager.loadModule(StarSystem.Ksp.moduleName);
                }
            },
        };
    }

    registerShortcuts() {
        this._shortcutManager.register({
            key: " ",
            handler: () => {
                this._simulationModel.timeModel.togglePause();
            },
        });
    }

    configureGlobalSettings() {
        window.oncontextmenu = () => false;
    }

    /**
     * @return {SimulationModel}
     * @private
     */
    get _simulationModel() {
        return this._appModel.simulationModel;
    }

    /**
     * @param {Universe} universe
     * @private
     */
    _selectUniverse(universe) {
        universe.initializeFeatures(this._appModel);

        runInAction(() => {
            this.activeUniverse = universe;
        });
    }
}

export default Application;
export { VisualObject } from "./entities/visual-object";
