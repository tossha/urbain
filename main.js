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

    camera = new Camera(renderer.domElement, rendererEvents, EARTH, new Vector([30000, 30000, 10000]));

    document.getElementById('viewport').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    textureLoader = new THREE.TextureLoader();

    raycaster = new VisualRaycaster(camera.threeCamera, 7);

    selection = new SelectionHandler(raycaster);

    for (const objId in SSDATA) {
        objectsForTracking[SSDATA[objId].name] = objId;
    }

    settings = new Settings({
        timeLinePos:        TimeLine.getEpochByDate(new Date()),
        timeScale:          0.001,
        isTimeRunning:      true,
        trackingObject:     EARTH,
        objectsForTracking: objectsForTracking,
    });

    document.addEventListener('vr_select', () => {
        const data = SSDATA[selection.getSelectedObject().id];
        if (data) {
            $('#relativeTo').html(SSDATA[data.parent].name);
            $('#metricsOf').html(data.name);
        } else {
            $('#relativeTo,#metricsOf').html('');
        }
    });

    time = new TimeLine(settings);

    statistics = new Stats();
    document.body.appendChild(statistics.dom);
    statistics.dom.style.display = "none";

    document.addEventListener('vr_select', function() {
        event.detail.trajectory.keplerianEditor = new KeplerianEditor(event.detail.trajectory, false)
    })

    document.addEventListener('vr_deselect', function() {
        event.detail.trajectory.keplerianEditor.remove();
    })
}

function initBuiltIn() {
    ObjectLoader.loadFromCnfig(SSDATA);

    stars = new VisualStarsModel(STARDATA);

    for (const id in TLEDATA) {
        const tle = new TLE(TLEDATA[id].lines);
        const objId = parseInt(id);

        App.setTrajectory(objId, new TrajectoryKeplerianPrecessing(
            App.getReferenceFrame(RF_TYPE_ECI),
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
            BODIES[EARTH].physicalModel.radius,
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

    for (const bodyIdx in BODIES) {
        BODIES[bodyIdx].render(time.epoch);
    }

    if (lastTrajectory = App.getTrajectory(lastTrajectoryId)) {
        lastTrajectory.epoch = time.epoch;
    }

    document.dispatchEvent(new CustomEvent(
        'vr_render',
        {detail: {epoch: time.epoch}}
    ));

    const state = App.getTrajectory(settings.trackingObject).getStateByEpoch(time.epoch, RF_BASE);
    for (const group of ['velocity', 'position']) {
        const stateGroup = state[group];
        for (const id of ['x', 'y', 'z', 'mag']) {
            const selector = $('#' + group + id.substr(0, 1).toUpperCase() + id.substr(1));
            selector.html('' + stateGroup[id].toPrecision(5));
        }
    }

    axisHelper.position.fromArray(camera.lastPosition.mul(-1));

    const selectedObject = selection.getSelectedObject();
    $('.keplerianParameter')[selectedObject ? 'show' : 'hide']();

    if (selectedObject) {
        const keplerianObject = selectedObject.getKeplerianObjectByEpoch(time.epoch);
        $( '#eccValue'  ).html('' +        ( keplerianObject.e         ).toPrecision(5) );
        $( '#smaValue'  ).html('' +        ( keplerianObject.sma / 1e6 ).toPrecision(5) );
        $( '#incValue'  ).html('' + rad2deg( keplerianObject.inc       ).toPrecision(5) );
        $( '#aopValue'  ).html('' + rad2deg( keplerianObject.aop       ).toPrecision(5) );
        $( '#raanValue' ).html('' + rad2deg( keplerianObject.raan      ).toPrecision(5) );
        $( '#taValue'   ).html('' + rad2deg( keplerianObject.ta        ).toPrecision(5) );
    }

    renderer.render(scene, camera.threeCamera);
    statistics.update();
    requestAnimationFrame(render);
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.onResize();
}

function changeVisibility(name) {
    const selector = $('.' + name);
    const button = $(`#${name}ToggleButton`);
    button.attr('disabled', 'true');
    selector.fadeToggle(400, 'swing', () => {
        button.html(selector.is(':visible') ? 'Hide' : 'Show');
        button.removeAttr('disabled');
    });
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

$(() => {
    init();
    initBuiltIn();
    requestAnimationFrame(firstRender);
});
