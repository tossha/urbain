import Universe from "../../application/entities/universe/universe";
import { SatelliteSearchModel } from "../../features/satellite-search";
import getDateByEpoch from "./helpers/get-date-by-epoch";
import getEpochByDate from "./helpers/get-epoch-by-date";
import roundDateUp from "./helpers/round-date-up";
import nextRenderingDate from "./helpers/next-rendering-date";
import formatDate from "./helpers/format-date";
import formatDateFull from "./helpers/format-date-full";

import SolarStarSystem from "./star-systems/default-solar-star-system/solar-star-system";
import { SATELLITE_SEARCH_MODEL_NAME, TLE_LOADER, UniverseRegistry } from "../universe-registry";
import TleLoader from "../../features/tle-loader/tle-loader";

const tleLoader = new TleLoader();

class SolarSystemUniverse extends Universe {
    constructor(options) {
        super(UniverseRegistry.SolarSystem.id, options);
        this.setDefaultStarSystem(this.starSystems[0]);
    }

    starSystems = [new SolarStarSystem(tleLoader)];
    /**
     * @param {AppModel} appModel
     */
    initializeFeatures(appModel) {
        this.addFeature(SATELLITE_SEARCH_MODEL_NAME, new SatelliteSearchModel(appModel));
        this.addFeature(TLE_LOADER, tleLoader);
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
