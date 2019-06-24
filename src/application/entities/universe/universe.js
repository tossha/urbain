import ModuleManager from "../../../modules/module-manager";
import FeaturesList from "./features-list";
import TimeModel from "./time-model";

class Universe {
    constructor() {
        this.moduleManager = new ModuleManager();
        this.timeModel = new TimeModel();
        this._features = new FeaturesList();
        this._starSystem = null;
    }

    get activeStarSystem() {
        return this._starSystem;
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
