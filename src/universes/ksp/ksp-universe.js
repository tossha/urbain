import Universe from "../../application/entities/universe/universe";
import getDateByEpoch from "./helpers/get-date-by-epoch";
import getEpochByDate from "./helpers/get-epoch-by-date";
import roundDateUp from "./helpers/round-date-up";
import nextRenderingDate from "./helpers/next-rendering-date";
import formatDate from "./helpers/format-date";
import formatDateFull from "./helpers/format-date-full";
import { timeScales } from "./constants";

class KspUniverse extends Universe {
    scales = timeScales;

    /**
     * @param {AppModel} appModel
     */
    initializeFeatures(appModel) {}

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

export default KspUniverse;
