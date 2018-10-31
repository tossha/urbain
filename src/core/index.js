import { sim } from "./Simulation";
import Events from "./Events";

function init(statistics, viewPortId = "viewport-id") {
    let globalTime;

    function render(curTime) {
        if (!sim.renderLoopActive) {
            return;
        }

        sim.tick((curTime - globalTime) / 1000);

        globalTime = curTime;
        statistics.update();
        requestAnimationFrame(render);
    }

    function firstRender(curTime) {
        globalTime = curTime;
        requestAnimationFrame(render);
    }

    sim.init(document.getElementById(viewPortId), firstRender);
    sim.loadModule('PatchedConics');
}

export {
    init,
    sim,
    Events,
}
