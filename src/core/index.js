import { sim } from "./Simulation";
import Events from "./Events";

/**
 * @param {SimulationModel} simulationModel
 */
export function init(simulationModel) {
    const { simulation } = simulationModel;

    let globalTime;

    function render(curTime) {
        if (!simulation.renderLoopActive) {
            return;
        }

        simulation.tick((curTime - globalTime) / 1000);

        globalTime = curTime;
        simulationModel.statisticsModel.updateStatistics();
        requestAnimationFrame(render);
    }

    function firstRender(curTime) {
        globalTime = curTime;
        requestAnimationFrame(render);
    }

    simulation.init(simulationModel, firstRender);
    simulation.loadModule("PatchedConics");
}

export {
    sim,
    Events,
}
