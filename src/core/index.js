import $ from "jquery";
import { sim } from "./Simulation";

function init(statistics, viewPortId = "viewport-id") {
    let globalTime;

    function render(curTime) {
        sim.tick((curTime - globalTime) / 1000);

        globalTime = curTime;
        statistics.update();
        requestAnimationFrame(render);
    }

    function firstRender(curTime) {
        globalTime = curTime;
        requestAnimationFrame(render);
    }

    $.getJSON("./star_systems/solar_system.json", starSystemConfig => {
        const viewPort = document.getElementById(viewPortId);

        if (viewPort) {
            sim.init(viewPort, starSystemConfig);
            requestAnimationFrame(firstRender);
        }
    });
}

export {
    init,
    sim,
}
