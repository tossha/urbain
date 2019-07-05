import ModuleManager from "../../../modules/module-manager";
import FeaturesList from "./features-list";
import TimeModel from "./time-model";
import {
    SECONDS_PER_DAY,
    SECONDS_PER_HOUR,
    SECONDS_PER_MINUTE,
    SECONDS_PER_MONTH,
    SECONDS_PER_WEEK,
    SECONDS_PER_YEAR,
} from "../../../constants/dates";

class Universe {
    constructor() {
        this.moduleManager = new ModuleManager();
        this.timeModel = new TimeModel(this);
        this._features = new FeaturesList();
        this._starSystem = null;
    }

    scales = {
        minute: SECONDS_PER_MINUTE,
        fiveMinutes: SECONDS_PER_MINUTE * 5,
        tenMinutes: SECONDS_PER_MINUTE * 10,
        thirtyMinutes: SECONDS_PER_MINUTE * 30,
        hour: SECONDS_PER_HOUR,
        threeHours: SECONDS_PER_HOUR * 3,
        sixHours: SECONDS_PER_HOUR * 6,
        day: SECONDS_PER_DAY,
        week: SECONDS_PER_WEEK,
        month: SECONDS_PER_MONTH,
        threeMonths: SECONDS_PER_MONTH * 3,
        year: SECONDS_PER_YEAR,
        fiveYears: SECONDS_PER_YEAR * 5,
    };

    get activeStarSystem() {
        return this._starSystem;
    }

    get dataTransforms() {
        return {
            getDateByEpoch() {
                throw new Error("This method must be overridden");
            },
            getEpochByDate() {
                throw new Error("This method must be overridden");
            },
            roundDateUp() {
                throw new Error("This method must be overridden");
            },
            nextRenderingDate() {
                throw new Error("This method must be overridden");
            },
            formatDate() {
                throw new Error("This method must be overridden");
            },
            formatDateFull() {
                throw new Error("This method must be overridden");
            },
        };
    }

    /**
     * @param {AppModel} appModel
     */
    initializeFeatures(appModel) {}

    hasFeature(featureId) {
        return this._features.has(featureId);
    }

    addFeature(featureId, feature) {
        this._features.add(featureId, feature);
    }

    getFeature(featureId) {
        return this._features.get(featureId);
    }

    changeStarSystem(starSystem) {
        this._starSystem = starSystem;
    }
}

export default Universe;
