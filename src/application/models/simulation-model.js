import { computed } from "mobx";
import StatisticsModel from "./statistics-model";
import { sim } from "../../core/Simulation";

export class SimulationModel {
    /**
     * @param {AppModel} appModel
     * @param {Universe} universe
     * @param {string} viewportId
     */
    constructor(appModel, universe, viewportId) {
        this._appModel = appModel;
        this._activeUniverse = universe;
        this._viewportId = viewportId;
        this._statisticsModel = new StatisticsModel();
    }

    /**
     * @return {string}
     */
    get viewportId() {
        return this._viewportId;
    }

    /**
     * @return {SimulationEngine | null}
     */
    get simulation() {
        return sim;
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
     * @return {TimeModel}
     */
    @computed
    get timeModel() {
        return this._activeUniverse.timeModel;
    }

    /**
     * @return {Universe}
     */
    get activeUniverse() {
        return this._activeUniverse;
    }

    runTime() {
        this.timeModel.run();
    }
}
