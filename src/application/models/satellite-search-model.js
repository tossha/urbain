class SatelliteSearchModel {
    /**
     * @param {AppModel} appModel
     * @param {SatelliteLookup} satelliteLookup
     */
    constructor(appModel, satelliteLookup) {
        this._appModel = appModel;
        this._satelliteLookup = satelliteLookup;
    }

    findSatellites(searchParams) {
        return this._satelliteLookup.findSatellites(searchParams);
    }

    /**
     * @param {number} noradId
     * @return {Promise<any>}
     */
    loadSatellite(noradId) {
        return this._appModel.simulationModel.loadTLE(noradId);
    }

    unloadSatellite(noradId) {
        return this._appModel.simulationModel.simulation.starSystem.deleteObject(-(100000 + (0 | noradId)));
    }
}

export default SatelliteSearchModel;
