import $ from "jquery";
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

    sim.loadModule('patchedConics');
    sim.init(document.getElementById(viewPortId), firstRender);

    $.getJSON("./star_systems/solar_system.json", starSystemConfig => {
        sim.loadStarSystem(starSystemConfig);
    });
}

export {
    init,
    sim,
    Events,
}
