import { observable } from "mobx";
import { VisualObject } from "./visual-object";
import { createStatsBadge } from "../../ui/components/statistics-badge";

export class AppModel {
    /**
     * @param {Simulation} simulation
     * @param {function} loadTLE
     * @param services
     */
    constructor(simulation, loadTLE, services) {
        this._simulation = simulation;
        this.loadTLE = loadTLE;
        this._services = services;
    }

    @observable
    visualObjects = {
        creationPanel: new VisualObject(false),
        transferCalculationPanel: new VisualObject(false),
        bodyLabels: new VisualObject(true),
        statisticsBadge: new VisualObject(false, createStatsBadge()),
        satelliteSearchPanel: new VisualObject(false),
    };

    /**
     * @return {Simulation}
     */
    get simulation() {
        return this._simulation;
    }

    get services() {
        return this._services;
    }
}
