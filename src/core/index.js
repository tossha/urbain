import { sim } from "./Simulation";
import Events from "./Events";

/**
 * @param {AppModel} appModel
 * @param {string} viewPortId
 */
function init(appModel, viewPortId) {
    const statistics = appModel.visualObjects.statisticsBadge.meta;
    const { simulation } = appModel;

    let globalTime;

    function render(curTime) {
        if (!simulation.renderLoopActive) {
            return;
        }

        simulation.tick((curTime - globalTime) / 1000);

        globalTime = curTime;
        statistics.update();
        requestAnimationFrame(render);
    }

    function firstRender(curTime) {
        globalTime = curTime;
        requestAnimationFrame(render);
    }

    simulation.init(appModel, viewPortId, firstRender);
    simulation.loadModule("PatchedConics");
}

export {
    init,
    sim,
    Events,
}
