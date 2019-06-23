import { computed } from "mobx";
import StatisticsModel from "./statistics-model";
import { sim } from "../../core/simulation-engine";

export class SimulationModel {
    /**
     * @param {AppModel} appModel
     * @param {Universe} universe
     */
    constructor(appModel, universe) {
        this._appModel = appModel;
        this._activeUniverse = universe;
        this._statisticsModel = new StatisticsModel();
        this._viewportElement = null;
    }

    /**
     * @return {{HTMLDivElement}}
     */
    get viewportElement() {
        return this._viewportElement;
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

    /**
     * @param {HTMLDivElement} element
     */
    setViewportElement(element) {
        this._viewportElement = element;
    }
}
