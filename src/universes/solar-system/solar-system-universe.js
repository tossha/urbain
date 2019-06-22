import Universe from "../../application/entities/universe/universe";
import SatelliteSearchModel from "../../features/satellite-search/satellite-search-model";

export const SatelliteSearchModelName = "SatelliteSearchModel";

class SolarSystemUniverse extends Universe {
    /**
     * @param {AppModel} appModel
     */
    initializeFeatures(appModel) {
        this.addFeature(SatelliteSearchModelName, new SatelliteSearchModel(appModel));
    }
}

export default SolarSystemUniverse;
