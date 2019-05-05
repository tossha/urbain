import { observable } from "mobx";
import { VisualObject } from "../entities/visual-object";
import { SimulationModel } from "./simulation-model";
import { sim } from "../../core";
import SatelliteSearchModel from "./satellite-search-model";

export class AppModel {
    /**
     * @param services
     * @param {string} viewportId
     */
    constructor(services, viewportId) {
        this._simulationModel = new SimulationModel(this, sim, viewportId);
        this._satelliteSearchModel = new SatelliteSearchModel(this, services.satelliteFinder);
    }

    @observable
    visualObjects = {
        creationPanel: new VisualObject(false),
        transferCalculationPanel: new VisualObject(false),
    };

    bodyLabels = new VisualObject(true);

    /**
     * @return {SimulationModel}
     */
    get simulationModel() {
        return this._simulationModel;
    }

    /**
     * @return {SatelliteSearchModel}
     */
    get satelliteSearchModel() {
        return this._satelliteSearchModel;
    }
}
