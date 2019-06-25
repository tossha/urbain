import ModuleManager from "../../../modules/module-manager";
import FeaturesList from "./features-list";
import TimeModel from "./time-model";

class Universe {
    constructor() {
        this.moduleManager = new ModuleManager();
        this.timeModel = new TimeModel(this);
        this._features = new FeaturesList();
        this._starSystem = null;
    }

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

    reselectStarSystem(starSystem) {
        this._starSystem = starSystem;
    }
}

export default Universe;
