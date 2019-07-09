import { computed } from "mobx";

class UniverseSelectorStore {
    constructor(appModel) {
        this._appModel = appModel;
    }

    @computed
    get options() {
        return this._appModel.availableUniverses.map(universe => ({
            ...universe,
            label: universe.name,
            value: universe.id,
        }));
    }

    @computed
    get defaultValue() {
        return this.options.find(universe => universe.id === this._appModel.activeUniverse.id);
    }

    onSelect = item => this._appModel.loadUniverseById(item.id);
}

export default UniverseSelectorStore;
