import SatelliteLookup from "../satellite-finder";

class SatelliteSearchModel {
    /**
     * @param {AppModel} appModel
     */
    constructor(appModel) {
        this._appModel = appModel;
        this._satelliteLookup = new SatelliteLookup("/api");
    }

    findSatellites(searchParams) {
        return this._satelliteLookup.findSatellites(searchParams);
    }

    /**
     * @param {number} noradId
     * @return {Promise<any>}
     */
    loadSatellite(noradId) {
        return this._appModel.loadTLE(noradId);
    }

    unloadSatellite(noradId) {
        const { activeStarSystem } = this._appModel.simulationModel.activeUniverse;

        return activeStarSystem.deleteObject(-(100000 + (0 | noradId)));
    }
}

export default SatelliteSearchModel;
