class SimulationStore {
    /**
     * @param {SimulationEngine} simulationEngine
     */
    constructor(simulationEngine) {
        this._simulationEngine = simulationEngine;
    }

    /**
     * @param {HTMLDivElement} viewportElement
     */
    startRenderLoop(viewportElement) {
        this._simulationEngine.startRenderLoop(viewportElement);
    }
}

export default SimulationStore;
