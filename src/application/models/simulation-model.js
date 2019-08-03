import { action, computed, observable } from "mobx";
import { getModuleNameById, TLE_LOADER, UniverseRegistry } from "../../universes/universe-registry";
import { VisualObject } from "..";
import Events from "../../core/Events";

export class SimulationModel {
    /**
     * @param {AppModel} appModel
     * @param {UniverseService} universeService
     * @param {StarSystemLoaderService} starSystemLoader
     */
    constructor(appModel, universeService, starSystemLoader) {
        this._appModel = appModel;
        this._universeService = universeService;
        this._starSystemLoader = starSystemLoader;
    }

    /**
     * @type {Universe}
     */
    @observable
    activeUniverse = null;
    availableUniverses = UniverseRegistry.allValues;
    isSimulationActive = false;
    bodyLabels = new VisualObject(true);

    /**
     * @return {boolean}
     */
    get isBodyLabelsVisible() {
        return this.bodyLabels.isVisible;
    }

    /**
     * @return {TimeModel}
     */
    @computed
    get timeModel() {
        return this.activeUniverse.timeModel;
    }
    /**
     * @param {string} universeId
     * @return {Promise}
     */
    async loadUniverseById(universeId) {
        const universeModuleName = getModuleNameById(universeId);

        if (this.activeUniverse) {
            this._unloadUniverse(universeId);
        }

        const universe = await this._universeService.loadUniverseModule(universeModuleName, {
            starSystemLoader: this._starSystemLoader,
        });

        this._selectUniverse(universe);

        return universe;
    }

    runTime() {
        this.timeModel.run();
    }

    startSimulation() {
        this.isSimulationActive = true;
    }

    stopSimulation() {
        this.isSimulationActive = false;
    }

    /**
     * @param {number} noradId
     * @return {Promise<any>}
     */
    loadTLE(noradId) {
        if (!this.activeUniverse.hasFeature(TLE_LOADER)) {
            return Promise.resolve();
        }

        const loader = this.activeUniverse.getFeature(TLE_LOADER);

        return loader.loadTLE(noradId);
    }

    /**
     * @param {Universe} universe
     * @private
     */
    @action
    _selectUniverse(universe) {
        universe.initializeFeatures(this._appModel);

        if (!this.activeUniverse) {
            universe.loadDefaultStarSystem(() => {
                Events.dispatch(Events.FIRST_RENDER);
            });
        }

        this.activeUniverse = universe;
    }

    _unloadUniverse(universeId) {
        if (universeId !== this.activeUniverse.id) {
            this.stopSimulation();
            this.activeUniverse.unload();
        }
    }
}
