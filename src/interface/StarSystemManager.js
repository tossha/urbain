import StarSystemEntry from "./StarSystemEntry";

export default class StarSystemManager {
    constructor() {
        this._starSystems = [];
        this._loadedIdx = null;

        // The first one loads by default
        this.add("solar_system", "SolarSystem", "Solar System");
        this.add("ksp", "KSP", "KSP System");
    }

    get starSystems() {
        return this._starSystems;
    }

    get defaultStarSystemIdx() {
        return 0;
    }

    get defaultStarSystem() {
        return this._starSystems[this.defaultStarSystemIdx];
    }

    add(alias, module, label) {
        const idx = this._starSystems.length;

        this._starSystems.push(new StarSystemEntry(idx, alias, label, module));
    }

    loadDefault(callback) {
        this.loadByIdx(this.defaultStarSystemIdx, callback);
    }

    loadByIdx(idx, callback) {
        if (idx === this._loadedIdx) {
            return;
        }

        const starSystem = this._findStarSystemByIdx(idx);

        if (!starSystem) {
            return;
        }

        starSystem.load(callback);
        this._loadedIdx = idx;
    }

    getCurrentStarSystem() {
        if (this._loadedIdx === null) {
            return undefined;
        }

        return this._starSystems[this._loadedIdx];
    }

    _findStarSystemByIdx(idx) {
        // TODO: Add idx validation

        return this._starSystems[idx];
    }
}
