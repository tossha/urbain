import { HeaderStore } from "./header-store";

export class AppStore {
    /**
     * @param {AppModel} appModel
     */
    constructor(appModel) {
        this._appModel = appModel;
        this._headerStore = new HeaderStore(appModel);
        this._webApiServices = appModel.services;
    }

    /**
     * @return {*|{statisticsBadge, satelliteSearchPanel, creationPanel, transferCalculationPanel, bodyLabels}}
     */
    get visualObjects() {
        return this._appModel.visualObjects;
    }

    /**
     * @return {HeaderStore}
     */
    get header() {
        return this._headerStore;
    }

    get starSystemSelectorSettings() {
        const { starSystemManager } = this._appModel.simulation;

        return {
            options: starSystemManager.starSystems,
            defaultValue: starSystemManager.defaultStarSystem,
            onSelect: item => starSystemManager.loadByIdx(item.idx),
        };
    }

    get webApiServices() {
        return this._webApiServices;
    }

    /**
     * @param {number} noradId
     * @return {Promise<any>}
     */
    loadSatellite = noradId => {
        return this._appModel.loadTLE(noradId);
    };

    unloadSatellite = noradId => {
        return this._appModel.simulation.starSystem.deleteObject(-(100000 + (0 | noradId)));
    };
}
