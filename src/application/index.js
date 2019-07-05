import { observable, runInAction } from "mobx";
import { renderUi } from "../ui";
import { createServices } from "./services";
import { AppModel } from "./models/app-model";
import { StarSystem } from "../constants/star-system";
import ShortcutManager from "./shortcut-manager";

const services = createServices();

class Application {
    /**
     * @type {Universe}
     */
    @observable
    activeUniverse = null;

    async loadDefaultUniverse() {
        const universe = await services.universeService.getDefaultUniverse();
        this._appModel = new AppModel(universe);
        this._shortcutManager = new ShortcutManager();

        this._selectUniverse(universe);
    }

    startRendering() {
        renderUi(this._appModel);

        this._appModel.simulationModel.runTime();
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
                this._appModel.simulationModel.timeModel.togglePause();
            },
        });
    }

    configureGlobalSettings() {
        window.oncontextmenu = () => false;
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
