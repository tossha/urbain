import { VisualObject } from "../../application/entities/visual-object";

class SatelliteSearchPanelStore extends VisualObject {
    /**
     * @param {SatelliteSearchModel} satelliteSearchModel
     */
    constructor(satelliteSearchModel) {
        super();
        this._satelliteSearchModel = satelliteSearchModel;
    }

    closePanel = () => {
        this.toggle(false);
    };

    findSatellites = searchParams => {
        return this._satelliteSearchModel.findSatellites(searchParams);
    };

    loadSatellite = noradId => {
        return this._satelliteSearchModel.loadSatellite(noradId);
    };

    unloadSatellite = noradId => {
        return this._satelliteSearchModel.unloadSatellite(noradId);
    };
}

export default SatelliteSearchPanelStore;
