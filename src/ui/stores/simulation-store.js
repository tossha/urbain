class SimulationStore {
    /**
     * @param {SimulationEngine} simulationEngine
     */
    constructor(simulationEngine) {
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
