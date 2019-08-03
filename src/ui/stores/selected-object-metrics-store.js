class SelectedObjectMetricsStore {
    /**
     * @param {SimulationEngine} simulationEngine
     */
    constructor(simulationEngine) {
        this._simulationEngine = simulationEngine;
    }

    closeMetricsPanel = () => {
        this._simulationEngine.selection.deselect();
    };
}

export default SelectedObjectMetricsStore;
