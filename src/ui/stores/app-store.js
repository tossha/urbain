import { HeaderStore } from "./header-store";
import SatelliteSearchPanelStore from "./satellite-search-panel-store";

class AppStore {
    /**
     * @param {AppModel} appModel
     * @param {SimulationModel} simulationModel
     */
    constructor(appModel, simulationModel) {
        this._appModel = appModel;
        this._simulationModel = simulationModel;
        this.satelliteSearchPanelStore = new SatelliteSearchPanelStore(appModel.satelliteSearchModel);
        this._headerStore = new HeaderStore(appModel, this.satelliteSearchPanelStore);
    }

    /**
     * @return {{creationPanel, transferCalculationPanel}}
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
        const { starSystemManager } = this._simulationModel.simulation;

        return {
            options: starSystemManager.starSystems,
            defaultValue: starSystemManager.defaultStarSystem,
            onSelect: item => starSystemManager.loadByIdx(item.idx),
        };
    }
}

export default AppStore;
