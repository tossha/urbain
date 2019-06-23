import { HeaderStore } from "./header-store";
import { SatelliteSearchPanelStore } from "../../features/satellite-search";
import { SATELLITE_SEARCH_MODEL_NAME } from "../../universes/solar-system/solar-system-universe";

class AppStore {
    /**
     * @param {AppModel} appModel
     * @param {SimulationModel} simulationModel
     */
    constructor(appModel, simulationModel) {
        this._appModel = appModel;
        this._simulationModel = simulationModel;
        this._headerStore = new HeaderStore(appModel, this);
        this._satelliteSearchPanelStore = null;
        this._initSearchPanelIfExist();
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

    get satelliteSearchPanel() {
        return this._satelliteSearchPanelStore;
    }

    setViewportElement = element => {
        this._simulationModel.setViewportElement(element);
    };

    _initSearchPanelIfExist() {
        const hasSatelliteSearchPanel = this._appModel.simulationModel.activeUniverse.hasFeature(
            SATELLITE_SEARCH_MODEL_NAME,
        );

        if (hasSatelliteSearchPanel) {
            const satelliteSearchModel = this._appModel.simulationModel.activeUniverse.getFeature(
                SATELLITE_SEARCH_MODEL_NAME,
            );
            this._satelliteSearchPanelStore = new SatelliteSearchPanelStore(satelliteSearchModel);
        }
    }
}

export default AppStore;
