
class Settings
{
    constructor(initial) {
        this.guiMain = new dat.GUI({width: 350});
        this.guiTimeLine = new dat.GUI({
            autoPlace: false,
            width: window.innerWidth * 0.9
        });

        document.getElementById('bottomPanel').appendChild(this.guiTimeLine.domElement);

        this.timeLine = initial.timeLinePos;
        this.timeScale = initial.timeScale;
        this.sizeScale = initial.sizeScale;
        this.isTimeRunning = initial.isTimeRunning;

        this.timeLineController = this.guiTimeLine.add(this, 'timeLine', initial.timeLineStart, initial.timeLineEnd);
        this.guiMain.add(this, 'timeScale', -2000, 2000);
        this.guiMain.add(this, 'isTimeRunning');

        this.timeLineController.onChange(function(value) {
            time.forceEpoch(value);
        });
    }
}

class Time
{
    constructor(settings) {
        this.epoch = settings.timeLine;
        this.settings = settings;
    }

    tick(timePassed) {
        if (this.settings.isTimeRunning) {
            this.epoch += timePassed * this.settings.timeScale;
            this.settings.timeLine = this.epoch;
            this.settings.timeLineController.updateDisplay();
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

    settings = new Settings({
        timeLineStart: 504921600,
        timeLineEnd:   504921600 + 31557600,
        timeLinePos:   504921600,
        timeScale:     100,
        isTimeRunning: true,
        sizeScale:     1
    });

    time = new Time(settings);
}

function initBuiltIn()
{
    for (id in SSDATA) {
        let traj;
        let trajConfig = SSDATA[id].traj;
        let frame = new ReferenceFrame(trajConfig.rf.origin, trajConfig.rf.type);
        let bodyId = parseInt(id);

        if (SSDATA[id].traj.type === 'static') {
            traj = new TrajectoryStaticPosition(frame, new Vector3(trajConfig.data[0], trajConfig.data[1], trajConfig.data[2]));
        } else if (SSDATA[id].traj.type === 'keplerian') {
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

        if (SSDATA[id].type === 'body') {
            BODIES[bodyId] = new Body(
                new VisualBodyModel(new VisualShapeSphere(SSDATA[id].vis.r * settings.sizeScale), SSDATA[id].vis.color),
                new PhysicalBodyModel(SSDATA[id].phys.mu, SSDATA[id].phys.r),
                traj,
                null
            );
        }
    }
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
