import { computed } from "mobx";

class UniverseSelectorStore {
    /**
     * @param {SimulationModel} simulationModel
     */
    constructor(simulationModel) {
        this._simulationModel = simulationModel;
    }

    @computed
    get options() {
        return this._simulationModel.availableUniverses.map(universe => ({
            ...universe,
            label: universe.name,
            value: universe.id,
        }));
    }

    @computed
    get defaultValue() {
        return this.options.find(universe => universe.id === this._simulationModel.activeUniverse.id);
    }

    onSelect = item => {
        this._simulationModel.loadUniverseById(item.id);
    };
}

export default UniverseSelectorStore;
