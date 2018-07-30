import $ from "jquery";
import * as dat from "dat.gui";
import Stats from "stats.js";

import { sim } from "./core/Simulation";
import StarSystemLoader from "./interface/StarSystemLoader";

window.loadTLE = function(noradId) {
    StarSystemLoader.loadTLE(sim.starSystem, noradId);
};

let statistics;
let globalTime;

export function init() {
    statistics = new Stats();
    statistics.dom.classList.add("fps-badge");

    document.body.appendChild(statistics.dom);
    statistics.dom.style.display = "none";
    statistics.showStatistics = false;

    const datGui = new dat.GUI();

    datGui.domElement.classList.add("diagnostic-info-switcher");
    datGui.add(statistics, "showStatistics").onChange(value => {
        statistics.dom.style.display = value ? "" : "none";
    });

    datGui.add(sim.settings.ui, "showBodyLabels");

    $.getJSON("./star_systems/solar_system.json", starSystemConfig => {
        const viewPort = document.getElementById("viewport-id");

        if(viewPort) {
            sim.init(viewPort, starSystemConfig);
            requestAnimationFrame(firstRender);
        }
    });
}

function firstRender(curTime) {
    globalTime = curTime;
    requestAnimationFrame(render);
}

function render(curTime) {
    sim.tick((curTime - globalTime) / 1000);

    globalTime = curTime;
    statistics.update();
    requestAnimationFrame(render);
}
