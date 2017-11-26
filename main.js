function init() {
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xFFEFD5, 0.15));

    axisHelper = new THREE.AxisHelper(1000000);
    scene.add(axisHelper);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    rendererEvents = new EventHandler(renderer.domElement);

    camera = new Camera(renderer.domElement, rendererEvents, starSystem.mainObject, new Vector([30000, 30000, 10000]));

    document.getElementById('viewport').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    textureLoader = new THREE.TextureLoader();

    raycaster = new VisualRaycaster(camera.threeCamera, 7);

    selection = new SelectionHandler(scene, raycaster);

    settings = new Settings({
        timeLinePos:        TimeLine.getEpochByDate(new Date()),
        timeScale:          0.001,
        isTimeRunning:      true,
        trackingObject:     starSystem.mainObject,
    });

    time = new TimeLine(settings);

    ui = new UI(5, starSystem.getObjectNames());

    statistics = new Stats();
    document.body.appendChild(statistics.dom);
    statistics.dom.style.display = "none";

    document.addEventListener(Events.SELECT, function() {
        event.detail.trajectory.keplerianEditor = new KeplerianEditor(event.detail.trajectory, false)
    });

    document.addEventListener(Events.DESELECT, function() {
        event.detail.trajectory.keplerianEditor.remove();
    });

    document.dispatchEvent(new CustomEvent(
        Events.SCENE_READY,
        {detail: {scene: scene}}
    ));
}

function initBuiltIn() {
    for (const id in TLEDATA) {
        const tle = new TLE(TLEDATA[id].lines);
        const objId = parseInt(id);

        starSystem.addTrajectory(objId, new TrajectoryKeplerianPrecessing(
            starSystem,
            RF_EARTH_EQUATORIAL_INERTIAL,
            new KeplerianObject(
                tle.getE(),
                tle.getSma(),
                tle.getAop(),
                tle.getInc(),
                tle.getRaan(),
                tle.getMeanAnomaly(),
                tle.getEpoch(),
                starSystem.getObject(EARTH).physicalModel.mu,
                false
            ),
            starSystem.getObject(EARTH).physicalModel.radius,
            0.00108263,
            TLEDATA[id].color ? TLEDATA[id].color : 'azure'
        ));
    }
}

function firstRender(curTime) {
    globalTime = curTime;
    camera.init(time.epoch);
    requestAnimationFrame(render);
}

function render(curTime) {
    let lastTrajectory;

    time.tick(curTime - globalTime);
    globalTime = curTime;

    camera.update(time.epoch);

    if (lastTrajectory = starSystem.getTrajectory(lastTrajectoryId)) {
        lastTrajectory.epoch = time.epoch;
    }

    document.dispatchEvent(new CustomEvent(
        Events.RENDER,
        {detail: {epoch: time.epoch}}
    ));

    axisHelper.position.fromArray(camera.lastPosition.mul(-1));

    renderer.render(scene, camera.threeCamera);
    statistics.update();
    requestAnimationFrame(render);
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.onResize();
}

var camera, scene, renderer, axisHelper, raycaster;
var settings, time, globalTime;
var textureLoader;
var lastTrajectoryId = -1;
var trajArray = [];
var selection;
var statistics;
var rendererEvents;
var ui;

$(() => {
    init();
    initBuiltIn();
    requestAnimationFrame(firstRender);
});
