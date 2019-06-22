class FeaturesList {
    _features = [];

    has(featureId) {
        return this._features[featureId] !== undefined;
    }

    add(featureId, feature) {
        this._features[featureId] = feature;
    }

    get(featureId) {
        if (this.has(featureId)) {
            return this._features[featureId];
        }

        return null;
    }
}

export default FeaturesList;
