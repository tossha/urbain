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

    @observable
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
     * @return {Promise<Universe>}
     */
    async loadUniverseById(universeId) {
        const universeModuleName = getModuleNameById(universeId);
        const isUniverseLoaded = this.activeUniverse !== null;

        if (isUniverseLoaded) {
            if (universeId === this.activeUniverse.id) {
                return this.activeUniverse;
            } else {
                this._unloadUniverse(this.activeUniverse.id);
            }
        }

        const universe = await this._universeService.loadUniverseModule(universeModuleName, {
            starSystemLoader: this._starSystemLoader,
        });

        this._selectUniverse(universe);

        universe
            .loadDefaultStarSystem(() => {
                Events.dispatch(Events.FIRST_RENDER);
            })
            .then(() => {
                this.startSimulation();
            });

        return universe;
    }

    runTime() {
        this.timeModel.run();
    }

    @action
    startSimulation() {
        this.isSimulationActive = true;
    }

    @action
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
        this.activeUniverse = universe;
    }

    _unloadUniverse() {
        this.stopSimulation();
        this.activeUniverse.unload();
    }
}
