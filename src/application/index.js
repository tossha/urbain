import { renderUi } from "../ui";
import { createServices } from "./services";
import { AppModel } from "./models/app-model";
import { UniverseRegistry } from "../universes/universe-registry";
import ShortcutManager from "./shortcut-manager";

const { universeService, starSystemLoader } = createServices();

class Application {
    constructor() {
        this._appModel = new AppModel(universeService, starSystemLoader);
        this._simulationModel = this._appModel.simulationModel;
        this._shortcutManager = new ShortcutManager();
    }

    async loadDefaultUniverse() {
        const universeId = universeService.getDefaultUniverseId();

        return await this._simulationModel.loadUniverseById(universeId);
    }

    startRendering() {
        renderUi(this._appModel);

        this._simulationModel.runTime();
    }

    getApi() {
        return {
            loadTLE: noradId => {
                return this._simulationModel.loadTLE(noradId);
            },
            loadKSP: () => {
                return this._simulationModel.loadUniverseById(UniverseRegistry.Ksp.id);
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
}

export default Application;
export { VisualObject } from "./entities/visual-object";
