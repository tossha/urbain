function init() {
    let objectsForTracking = {};

    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xFFEFD5, 0.15));

    axisHelper = new THREE.AxisHelper(100000000);
    scene.add(axisHelper);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new Camera(renderer.domElement, SUN, new Vector([300000000, 300000000, 300000000]));

    document.getElementById('viewport').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    textureLoader = new THREE.TextureLoader();

    for (let objId in SSDATA) {
        objectsForTracking[SSDATA[objId].name] = objId;
    }

    settings = new Settings({
        timeLineStart:      504921600,
        timeLineEnd:        504921600 + 31557600,
        timeLinePos:        504921600,
        timeScale:          100,
        isTimeRunning:      true,
        trackingObject:     SUN,
        objectsForTracking: objectsForTracking,
    });

    time = new Time(settings);
}

function initBuiltIn() {
    for (let id in SSDATA) {
        const body = SSDATA[id];
        const bodyId = parseInt(id);
        const trajConfig = body.traj;
        const frame = App.getReferenceFrame(trajConfig.rf.origin, trajConfig.rf.type);
        let traj;

        if (trajConfig.type === 'static') {
            traj = new TrajectoryStaticPosition(frame, new Vector([trajConfig.data[0], trajConfig.data[1], trajConfig.data[2]]));
        } else if (trajConfig.type === 'keplerian') {
            let color = null;

            if (trajConfig.color !== undefined) {
                color = trajConfig.color;
            }

            traj = new TrajectoryKeplerianOrbit(
                frame,
                trajConfig.data.mu,
                trajConfig.data.sma,
                trajConfig.data.e,
                deg2rad(trajConfig.data.inc),
                deg2rad(trajConfig.data.raan),
                deg2rad(trajConfig.data.aop),
                deg2rad(trajConfig.data.ta),
                trajConfig.data.epoch,
                color
            );
        }

        TRAJECTORIES[bodyId] = traj;

        if (body.type === 'body') {
            let visualShape = new VisualShapeSphere(
                body.visual.r,
                body.visual.texture ? 32 : 12
            );
            let visualModel = (bodyId == SUN)
                ? new VisualBodyModelLight(
                    visualShape,
                    body.visual.color,
                    body.visual.texture,
                    body.visual.lightColor,
                    body.visual.lightIntensity,
                    body.visual.lightDistance,
                    body.visual.lightDecay
                )
                : new VisualBodyModelBasic(
                    visualShape,
                    body.visual.color,
                    body.visual.texture
                );

            BODIES[bodyId] = new Body(
                visualModel,
                new PhysicalBodyModel(
                    body.phys.mu,
                    body.phys.r
                ),
                traj,
                new Orientation(
                    body.orientation.epoch,
                    (new Quaternion()).setFromEuler(
                        body.orientation.axisX,
                        body.orientation.axisY,
                        body.orientation.axisZ
                    ),
                    body.orientation.angVel
                )
            );
        }
    }

    stars = new VisualStarsModel(STARDATA);

    for (let id in TLEDATA) {
        const tle = new TLE(TLEDATA[id].lines);
        const objId = parseInt(id);

        TRAJECTORIES[objId] = new TrajectoryKeplerianOrbit(
            App.getReferenceFrame(EARTH, RF_TYPE_EQUATORIAL),
            BODIES[EARTH].physicalModel.mu,
            tle.getSma(),
            tle.getE(),
            tle.getInc(),
            tle.getRaan(),
            tle.getAop(),
            tle.getMeanAnomaly(),
            tle.getEpoch(),
            TLEDATA[id].color ? TLEDATA[id].color : 'azure',
            false
        );
    }
}

function firstRender(curTime) {
    globalTime = curTime;
    requestAnimationFrame(render);
}

function render(curTime) {
    time.tick(curTime - globalTime);
    globalTime = curTime;

    camera.update(time.epoch);

    for (let bodyIdx in BODIES) {
        BODIES[bodyIdx].render(time.epoch);
    }

    for (let trajIdx in TRAJECTORIES) {
        if (trajIdx == lastTrajectoryId) {
            TRAJECTORIES[trajIdx].epoch = time.epoch;
        }
        TRAJECTORIES[trajIdx].render(time.epoch);
    }

    const trajectoryMenu = settings.currentTrajectoryMenu;
    const state = TRAJECTORIES[settings.trackingObject].getStateByEpoch(time.epoch, RF_BASE);
    for (let group of ['velocity', 'position']) {
        const trajectoryGroup = trajectoryMenu[group];
        const stateGroup = state[group];
        for (let id of ['x', 'y', 'z', 'mag']) {
            trajectoryGroup[id].setValue("" + stateGroup[id]);
        }
    }

    axisHelper.position.fromArray(camera.lastPosition.mul(-1));

    renderer.render(scene, camera.threeCamera);
    requestAnimationFrame(render);
}

function onWindowResize() {
    camera.onResize();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var camera, scene, renderer, axisHelper;
var settings, time, globalTime;
var textureLoader;
var lastTrajectoryId = -1;
var stars;

window.onload = function () {
    init();
    initBuiltIn();
    requestAnimationFrame(firstRender);
};
