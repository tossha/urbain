import { observable } from "mobx";
import { VisualObject } from "../../application";
import { HeaderStore } from "./header-store";
import { SatelliteSearchPanelStore } from "../../features/satellite-search";
import { SATELLITE_SEARCH_MODEL_NAME } from "../../universes/universe-registry";

class AppStore {
    /**
     * @param {AppModel} appModel
     * @param {SimulationEngine} simulationEngine
     */
    constructor(appModel, simulationEngine) {
        this._appModel = appModel;
        this._simulationEngine = simulationEngine;
        this._headerStore = new HeaderStore(appModel, this);
        this._satelliteSearchPanelStore = null;
        this._initSearchPanelIfExist();
    }

    @observable
    visualObjects = {
        creationPanel: new VisualObject(false),
        transferCalculationPanel: new VisualObject(false),
    };

    /**
     * @return {HeaderStore}
     */
    get header() {
        return this._headerStore;
    }

    get satelliteSearchPanel() {
        return this._satelliteSearchPanelStore;
    }

    _initSearchPanelIfExist() {
        const { activeUniverse } = this._appModel.simulationModel;
        const hasSatelliteSearchPanel = activeUniverse.hasFeature(SATELLITE_SEARCH_MODEL_NAME);

        if (hasSatelliteSearchPanel) {
            const satelliteSearchModel = activeUniverse.getFeature(SATELLITE_SEARCH_MODEL_NAME);
            this._satelliteSearchPanelStore = new SatelliteSearchPanelStore(satelliteSearchModel);
        }
    }
}

export default AppStore;
