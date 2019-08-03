class SimulationStore {
    /**
     * @param {SimulationEngine} simulationEngine
     * @param {SimulationModel} simulationModel
     */
    constructor(simulationModel, simulationEngine) {
        this._simulationModel = simulationModel;
        this._simulationEngine = simulationEngine;

        window.addEventListener("resize", this._handleWindowResize);
    }

    /**
     * @param {HTMLDivElement} viewportElement
     */
    startRenderLoop(viewportElement) {
        this._simulationEngine.startRenderLoop(viewportElement);
    }

    _handleWindowResize = event => {
        this._simulationEngine.onWindowResize(event);
    };
}

export default SimulationStore;
