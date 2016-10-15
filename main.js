
class Settings
{
    constructor() {
        this.guiMain = new dat.GUI({width: 350});
        this.guiTimeLine = new dat.GUI({
            autoPlace: false,
            width: window.innerWidth * 0.9
        });

        document.getElementById('bottomPanel').appendChild(this.guiTimeLine.domElement);

        this.timeLine = 0;
        this.timeScale = 200;
        this.sizeScale = 20;
        this.isTimeRunning = true;

        this.timeLineController = this.guiTimeLine.add(this, 'timeLine', 0, 31557600);
        this.guiMain.add(this, 'timeScale', -2000, 2000);
        this.guiMain.add(this, 'isTimeRunning');

        this.timeLineController.onChange(function(value) {
            time.forceEpoch(value);
        });
    }
}

class Time
{
    constructor(settings, initialEpoch, initialSpeed) {
        this.epoch = initialEpoch;
        this.settings = settings;
        
        settings.timeLine = this.epoch;
        settings.timeScale = initialSpeed;
    }

    tick(timePassed) {
        if (settings.isTimeRunning) {
            this.epoch += timePassed * settings.timeScale;
            settings.timeLine = this.epoch;
            settings.timeLineController.updateDisplay();
        }
    }

    forceEpoch(newEpoch) {
        this.epoch = newEpoch;
    }
}

class Body
{
    constructor(visualModel, physicalModel, trajectory, orientation) {
        this.visualModel   = visualModel;    // class VisualBodyModel
        this.physicalModel = physicalModel;  // class PhysicalBodyModel
        this.trajectory    = trajectory;     // class TrajectoryAbstract
        this.orientation   = orientation;

        this.visualModel.body = this;
    }

    getPositionByEpoch(epoch, referenceFrame) {
        return this.trajectory.getPositionByEpoch(epoch, referenceFrame);
    }

    render(epoch) {
        return this.visualModel.render(epoch);
    }
}

function init()
{
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000000000);
    camera.position.x = 300000000;
    camera.position.y = 300000000;
    camera.position.z = 300000000;
    camera.up = new THREE.Vector3(0, 0, 1);

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100000000));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    document.getElementById('viewport').appendChild(renderer.domElement);

    settings = new Settings();

    time = new Time(settings, 0, 200);
}

function initBuiltIn()
{
    TRAJECTORIES[SOLAR_SYSTEM_BARYCENTER] = new TrajectoryStaticPosition(
        RF_BASE, // reference frame
        ZERO_VECTOR
    );

    TRAJECTORIES[EARTH_BARYCENTER] = new TrajectoryKeplerianOrbit(
        RF_BASE,    // reference frame
        MU[SUN],    // mu
        149598261,  // sma
        0.01671123, // e
        0,          // inc
        deg2rad(348.73936),  // raan
        deg2rad(114.20783),  // aop
        0,          // m0
        0,          // epoch
        'blue'      // color
    );

    TRAJECTORIES[EARTH] = new TrajectoryStaticPosition(
        RF_EARTH_B, // reference frame
        ZERO_VECTOR
    );

    TRAJECTORIES[MOON] = new TrajectoryKeplerianOrbit(
        RF_EARTH_B,      // reference frame
        MU[EARTH],       // mu
        384399,          // sma
        0.0549,          // e
        deg2rad(5.145),  // inc
        deg2rad(0),      // raan
        deg2rad(0),      // aop
        0,               // m0
        0,               // epoch
        'white'          // color
    );

    BODIES[EARTH] = new Body(
        new VisualBodyModel(new VisualShapeSphere(6378.1363 * settings.sizeScale), 'blue'),
        new PhysicalBodyModel(MU[EARTH], 6378.1363),
        TRAJECTORIES[EARTH],
        null
    );

    BODIES[MOON] = new Body(
        new VisualBodyModel(new VisualShapeSphere(1738.2 * settings.sizeScale), 'white'),
        new PhysicalBodyModel(MU[MOON], 1738.2),
        TRAJECTORIES[MOON],
        null
    );
}

function firstRender(curTime) {
    globalTime = curTime;
    requestAnimationFrame(render);
}

function render(curTime) {
    time.tick(curTime - globalTime);
    globalTime = curTime;

    controls.update();

    for (bodyIdx in BODIES) {
        BODIES[bodyIdx].render(time.epoch);
    }

    for (trajIdx in TRAJECTORIES) {
        TRAJECTORIES[trajIdx].render(time.epoch);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

var camera, scene, renderer, controls;
var settings, time, globalTime;

window.onload = function () {
    init();
    initBuiltIn();
    requestAnimationFrame(firstRender);
}
