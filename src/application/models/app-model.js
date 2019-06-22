import { observable } from "mobx";
import { VisualObject } from "../entities/visual-object";
import { SimulationModel } from "./simulation-model";
import { StarSystem } from "../../constants/star-system";

export class AppModel {
    /**
     * @param {string} viewportId
     * @param {Universe} universe
     */
    constructor(viewportId, universe) {
        this._activeUniverse = universe;
        this._simulationModel = new SimulationModel(this, universe, viewportId);
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
     * @param {number} noradId
     * @return {Promise<any>}
     */
    loadTLE(noradId) {
        return this._activeUniverse.moduleManager
            .getModule(StarSystem.SolarSystem.moduleName)
            .loadTLE(this._activeUniverse.activeStarSystem, noradId);
    }
}
