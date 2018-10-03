import $ from "jquery";
import * as dat from "dat.gui";
import Stats from "stats.js";

import Simulation from "./core/Simulation";
import StarSystemLoader from "./interface/StarSystemLoader";

window.loadTLE = function(noradId) {
    StarSystemLoader.loadTLE(window.sim.starSystem, noradId);
};

let statistics;
let globalTime;

function init() {
    const datGui = new dat.GUI();
    statistics = new Stats();
    document.body.appendChild(statistics.dom);
    statistics.dom.style.display = "none";
    statistics.showStatistics = false;

    datGui.add(statistics, "showStatistics").onChange(value => {
        statistics.dom.style.display = value ? "" : "none";
    });

    window.sim = new Simulation();

    datGui.add(window.sim.settings.ui, "showBodyLabels");

    $.getJSON("./star_systems/solar_system.json", starSystemConfig => {
        window.sim.init("viewport", starSystemConfig);
        requestAnimationFrame(firstRender);
    });
}

function firstRender(curTime) {
    globalTime = curTime;
    requestAnimationFrame(render);
}

function render(curTime) {
    window.sim.tick((curTime - globalTime) / 1000);

    globalTime = curTime;
    statistics.update();
    requestAnimationFrame(render);
}

$(() => {
    init();
});
