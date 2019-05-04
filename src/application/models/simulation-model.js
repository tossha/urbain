import { StarSystem } from "../../interface/star-system";
import StatisticsModel from "./statistics-model";

export class SimulationModel {
    /**
     * @param {AppModel} appModel
     * @param {Simulation} sim
     * @param {string} viewportId
     */
    constructor(appModel, sim, viewportId) {
        this._viewportId = viewportId;
        this._simulation = sim;
        this._appModel = appModel;
        this._statisticsModel = new StatisticsModel();
    }

    /**
     * @return {string}
     */
    get viewportId() {
        return this._viewportId;
    }

    /**
     * @return {Simulation}
     */
    get simulation() {
        return this._simulation;
    }

    /**
     * @return {boolean}
     */
    get isBodyLabelsVisible() {
        return this._appModel.bodyLabels.isVisible;
    }

    /**
     * @return {StatisticsModel}
     */
    get statisticsModel() {
        return this._statisticsModel;
    }

    /**
     * @param {number} noradId
     * @return {Promise<any>}
     */
    loadTLE(noradId) {
        return this._simulation
            .getModule(StarSystem.SolarSystem.moduleName)
            .loadTLE(this._simulation.starSystem, noradId);
    }

    /**
     * @return {Promise}
     */
    loadKSP() {
        return this._simulation.loadModule(StarSystem.Ksp.moduleName);
    }
}
