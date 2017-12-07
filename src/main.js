import Simulation from "./core/Simulation";
import StarSystemLoader from "./interface/StarSystemLoader";

function init() {
    statistics = new Stats();
    document.body.appendChild(statistics.dom);
    statistics.dom.style.display = "none";
    statistics.showStatistics = false;

    (new dat.GUI({width: 200})).add(statistics, 'showStatistics').onChange(value => {
        statistics.dom.style.display = value ? "" : "none";
    });

    window.sim = new Simulation();
    window.sim.init('viewport', starSystemConfig);
    starSystemConfig = undefined;

    StarSystemLoader.loadObjectByUrl(sim.starSystem, '/spacecraft/voyager1.json');
    StarSystemLoader.loadObjectByUrl(sim.starSystem, '/spacecraft/voyager2.json');
    // StarSystemLoader.loadObjectByUrl(sim.starSystem, '/spacecraft/lro.json');
}

function firstRender(curTime) {
    globalTime = curTime;
    requestAnimationFrame(render);
}

function render(curTime) {
    sim.tick(curTime - globalTime);

    globalTime = curTime;
    statistics.update();
    requestAnimationFrame(render);
}

var statistics;

let globalTime;

$(() => {
    init();
    requestAnimationFrame(firstRender);
});
