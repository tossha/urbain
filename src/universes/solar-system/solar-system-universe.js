import Universe from "../../application/entities/universe/universe";
import { SatelliteSearchModel } from "../../features/satellite-search";
import getDateByEpoch from "./helpers/get-date-by-epoch";
import getEpochByDate from "./helpers/get-epoch-by-date";
import roundDateUp from "./helpers/round-date-up";
import nextRenderingDate from "./helpers/next-rendering-date";
import formatDate from "./helpers/format-date";
import formatDateFull from "./helpers/format-date-full";

export const SATELLITE_SEARCH_MODEL_NAME = "SatelliteSearchModel";

class SolarSystemUniverse extends Universe {
    /**
     * @param {AppModel} appModel
     */
    initializeFeatures(appModel) {
        this.addFeature(SATELLITE_SEARCH_MODEL_NAME, new SatelliteSearchModel(appModel));
    }

    get dataTransforms() {
        return {
            getDateByEpoch,
            getEpochByDate,
            roundDateUp,
            nextRenderingDate,
            formatDate,
            formatDateFull,
        };
    }
}

export default SolarSystemUniverse;
