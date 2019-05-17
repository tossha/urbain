class SelectedObjectMetricsStore {
    /**
     * @param {SimulationModel} simulationModel
     */
    constructor(simulationModel) {
        this._simulationModel = simulationModel;
    }

    closeMetricsPanel = () => {
        this._simulationModel.simulation.selection.deselect();
    };
}

export default SelectedObjectMetricsStore;
