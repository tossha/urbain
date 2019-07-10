import { SimulationModel } from "./simulation-model";
import StatisticsModel from "./statistics-model";

export class AppModel {
    /**
     * @param {UniverseService} universeService
     * @param {StarSystemLoaderService} starSystemLoader
     */
    constructor(universeService, starSystemLoader) {
        this._simulationModel = new SimulationModel(this, universeService, starSystemLoader);
        this._statisticsModel = new StatisticsModel();
    }

    /**
     * @return {SimulationModel}
     */
    get simulationModel() {
        return this._simulationModel;
    }

    /**
     * @return {StatisticsModel}
     */
    get statisticsModel() {
        return this._statisticsModel;
    }
}
