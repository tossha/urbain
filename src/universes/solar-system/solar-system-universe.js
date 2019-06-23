import Universe from "../../application/entities/universe/universe";
import { SatelliteSearchModel } from "../../features/satellite-search";

export const SATELLITE_SEARCH_MODEL_NAME = "SatelliteSearchModel";

class SolarSystemUniverse extends Universe {
    /**
     * @param {AppModel} appModel
     */
    initializeFeatures(appModel) {
        this.addFeature(SATELLITE_SEARCH_MODEL_NAME, new SatelliteSearchModel(appModel));
    }
}

export default SolarSystemUniverse;
