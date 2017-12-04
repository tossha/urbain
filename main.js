function init() {
    statistics = new Stats();
    document.body.appendChild(statistics.dom);
    statistics.dom.style.display = "none";
    statistics.showStatistics = false;

    (new dat.GUI({width: 200})).add(statistics, 'showStatistics').onChange(value => {
        statistics.dom.style.display = value ? "" : "none";
    });

    sim = new Simulation();
    sim.init('viewport', starSystemConfig);
    starSystemConfig = undefined;
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

var sim;
var statistics;

let globalTime;

$(() => {
    init();
    requestAnimationFrame(firstRender);
});
