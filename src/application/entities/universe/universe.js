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
    /**
     * @param {string} id - Universe id which is stored in the UniverseRegistry
     * @param options
     */
    constructor(id, options) {
        this.id = id;
        this.timeModel = new TimeModel(this);
        this._starSystemLoader = options.starSystemLoader;
        this._defaultStarSystem = null;
        this._features = new FeaturesList();
    }

    timeScales = {
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

    /**
     * @type {Array<StarSystem>}
     */
    starSystems = [];

    /**
     * @type {StarSystem | null}
     */
    activeStarSystem = null;

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

    get defaultStarSystem() {
        return this._defaultStarSystem ? this._defaultStarSystem : this.starSystems[0];
    }

    /**
     * @param {AppModel} appModel
     */
    initializeFeatures(appModel) {}

    /**
     * @param {string} featureId
     * @return {boolean}
     */
    hasFeature(featureId) {
        return this._features.has(featureId);
    }

    /**
     * @param {string} featureId
     * @param feature
     */
    addFeature(featureId, feature) {
        this._features.add(featureId, feature);
    }

    /**
     * @param {string} featureId
     * @return {*}
     */
    getFeature(featureId) {
        return this._features.get(featureId);
    }

    loadDefaultStarSystem(onLoaded) {
        const starSystemName = this.defaultStarSystem.name;

        this.loadStarSystem(starSystemName, onLoaded);
    }

    loadStarSystem(starSystemName, onLoaded) {
        const starSystem = this.starSystems.find(system => system.name === starSystemName);

        if (starSystem) {
            starSystem.instance.load(this._starSystemLoader, onLoaded);
        }
    }

    unload() {
        if (this.activeStarSystem !== null) {
            this.activeStarSystem.unload();
        }
    }

    /**
     * @param {StarSystem} starSystem
     */
    changeStarSystem(starSystem) {
        if (this.activeStarSystem !== null) {
            this.activeStarSystem.unload();
        }

        this.activeStarSystem = starSystem;
    }

    /**
     * @param {StarSystem} defaultStarSystem
     */
    setDefaultStarSystem(defaultStarSystem) {
        this._defaultStarSystem = defaultStarSystem;
    }
}

export default Universe;
