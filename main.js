function init() {
    let objectsForTracking = {
        'Solar System barycenter': SOLAR_SYSTEM_BARYCENTER
    };

    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xFFEFD5, 0.15));

    axisHelper = new THREE.AxisHelper(100000000);
    scene.add(axisHelper);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    rendererEvents = new EventHandler(renderer.domElement);

    camera = new Camera(renderer.domElement, rendererEvents, EARTH, new Vector([300000, 300000, 300000]));

    document.getElementById('viewport').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    textureLoader = new THREE.TextureLoader();

    raycaster = new VisualRaycaster(camera.threeCamera, 7);

    selection = new SelectionHandler(raycaster);

    for (let objId in SSDATA) {
        objectsForTracking[SSDATA[objId].name] = objId;
    }

    settings = new Settings({
        timeLineStart:      504921600,
        timeLineEnd:        504921600 + 31557600,
        timeLinePos:        504921600,
        timeScale:          100,
        isTimeRunning:      true,
        trackingObject:     EARTH,
        objectsForTracking: objectsForTracking,
    });

    time = new TimeLine(settings);

    statistics = new Stats();
    document.body.appendChild(statistics.dom);
    statistics.dom.style.display = "none";
}

function initBuiltIn() {
    ObjectLoader.loadFromCnfig(SSDATA);

    stars = new VisualStarsModel(STARDATA);

    for (let id in TLEDATA) {
        const tle = new TLE(TLEDATA[id].lines);
        const objId = parseInt(id);

        App.setTrajectory(objId, new TrajectoryKeplerianOrbit(
            App.getReferenceFrame(EARTH, RF_TYPE_EQUATORIAL),
            new KeplerianObject(
                tle.getE(),
                tle.getSma(),
                tle.getAop(),
                tle.getInc(),
                tle.getRaan(),
                tle.getMeanAnomaly(),
                tle.getEpoch(),
                BODIES[EARTH].physicalModel.mu,
                false
            ),
            TLEDATA[id].color ? TLEDATA[id].color : 'azure',
            false
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

    for (let bodyIdx in BODIES) {
        BODIES[bodyIdx].render(time.epoch);
    }

    if (lastTrajectory = App.getTrajectory(lastTrajectoryId)) {
        lastTrajectory.epoch = time.epoch;
    }

    document.dispatchEvent(new CustomEvent(
        'vr_render',
        {detail: {epoch: time.epoch}}
    ));

    const trajectoryMenu = settings.currentTrajectoryMenu;
    const state = App.getTrajectory(settings.trackingObject).getStateByEpoch(time.epoch, RF_BASE);
    for (let group of ['velocity', 'position']) {
        const trajectoryGroup = trajectoryMenu[group];
        const stateGroup = state[group];
        for (let id of ['x', 'y', 'z', 'mag']) {
            trajectoryGroup[id].setValue("" + stateGroup[id]);
        }
    }

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
var stars;
var trajArray = [];
var selection;
var statistics;
var rendererEvents;

window.onload = function () {
    init();
    initBuiltIn();
    requestAnimationFrame(firstRender);
};
