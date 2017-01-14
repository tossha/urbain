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
        this.isTimeRunning = initial.isTimeRunning;
        this.trackingObject = initial.trackingObject;

        this.timeLineController = this.guiTimeLine.add(this, 'timeLine', initial.timeLineStart, initial.timeLineEnd);
        this.guiMain.add(this, 'timeScale', -2000, 2000);
        this.guiMain.add(this, 'isTimeRunning');
        this.guiMain.add(this, 'trackingObject', initial.objectsForTracking).onChange(function(value) {
            trackingCoords = TRAJECTORIES[value].getPositionByEpoch(time.epoch, RF_BASE);
        });

        const trajectoryMenu = {
            velocity: {
                folder: null,
                x   : null,
                y   : null,
                z   : null,
                mag : null,

                values: {
                    x   : "",
                    y   : "",
                    z   : "",
                    mag : ""
                }
            },

            position: {
                folder: null,
                x   : null,
                y   : null,
                z   : null,
                mag : null,

                values: {
                    x   : "",
                    y   : "",
                    z   : "",
                    mag : ""
                }
            }
        };

        for (let group of ['velocity', 'position']) {
            trajectoryMenu[group].folder = this.guiMain.addFolder(group);
            for (let id of ['x', 'y', 'z', 'mag']) {
                trajectoryMenu[group][id] = trajectoryMenu[group].folder.add(trajectoryMenu[group].values, id);
            }
        }

        this.currentTrajectoryMenu = trajectoryMenu;

        this.timeLineController.onChange(function(value) {
            time.forceEpoch(value);
        });

        this.guiAddTrajectory = new dat.GUI({
            autoPlace: false,
            width: 350
        });

        const that = this;
        this.baseTrajectorySettings = {
            sma  : 120000000,
            e    : 0,
            inc  : 0,
            raan : 0,
            aop  : 0,
            ta   : 0,
        };

        this.guiAddTrajectoryElements = {
            sma: null, e: null, inc: null, raan: null, aop: null, ta: null,
            settingsFolder: null, addTrajectoryFolder: null
        };

        this.trajectorySettings = {
            sma  : this.baseTrajectorySettings.sma  + 1e-2,
            e    : this.baseTrajectorySettings.e    + 1e-2,
            inc  : this.baseTrajectorySettings.inc  + 1e-2,
            raan : this.baseTrajectorySettings.raan + 1e-2,
            aop  : this.baseTrajectorySettings.aop  + 1e-2,
            ta   : this.baseTrajectorySettings.ta   + 1e-2,

            addTrajectory: function() {
                that.guiAddTrajectoryElements.sma  .setValue(that.baseTrajectorySettings.sma);
                that.guiAddTrajectoryElements.e    .setValue(that.baseTrajectorySettings.e  );

                that.guiAddTrajectoryElements.inc  .setValue(deg2rad(that.baseTrajectorySettings.inc ));
                that.guiAddTrajectoryElements.raan .setValue(deg2rad(that.baseTrajectorySettings.raan));
                that.guiAddTrajectoryElements.aop  .setValue(deg2rad(that.baseTrajectorySettings.aop ));
                that.guiAddTrajectoryElements.ta   .setValue(deg2rad(that.baseTrajectorySettings.ta  ));

                if (!TRAJECTORIES[lastTrajectoryId]) {
                    TRAJECTORIES[lastTrajectoryId] = new TrajectoryKeplerianOrbit(
                        new ReferenceFrame(that.trackingObject),
                        BODIES[that.trackingObject]
                            ? BODIES[that.trackingObject].physicalModel.mu
                            : 0,
                        that.trajectorySettings.sma,
                        that.trajectorySettings.e,
                        deg2rad(that.trajectorySettings.inc ),
                        deg2rad(that.trajectorySettings.raan),
                        deg2rad(that.trajectorySettings.aop ),
                        deg2rad(that.trajectorySettings.ta  ),
                        time.epoch,
                        '#00ff00'
                    );
                }

                that.guiAddTrajectoryElements.addTrajectoryFolder.close();
                that.guiAddTrajectoryElements.settingsFolder.open();
            },

            saveTrajectory: function() {
                while (TRAJECTORIES[lastTrajectoryId]) {
                    --lastTrajectoryId;
                }

                that.guiAddTrajectoryElements.addTrajectoryFolder.open();
                that.guiAddTrajectoryElements.settingsFolder.close();
            },

            dropLastTrajectory: function() {
                while (!TRAJECTORIES[lastTrajectoryId]
                    && (lastTrajectoryId !== -1)
                ) {
                    ++lastTrajectoryId;
                }

                if (TRAJECTORIES[lastTrajectoryId]) {
                    TRAJECTORIES[lastTrajectoryId].drop();
                    delete TRAJECTORIES[lastTrajectoryId];
                }

                that.guiAddTrajectoryElements.addTrajectoryFolder.open();
                that.guiAddTrajectoryElements.settingsFolder.close();
            }
        };

        this.guiAddTrajectoryElements.settingsFolder = this.guiAddTrajectory.addFolder("trajectory settings");

        this.guiAddTrajectoryElements.sma = this.guiAddTrajectoryElements.settingsFolder.add(
            this.trajectorySettings, 'sma', 1500000, 8000000000
        ).onChange(function(value) {
            const trajectory = TRAJECTORIES[lastTrajectoryId];
            if (trajectory) {
                trajectory.sma = value;
            }
        });

        this.guiAddTrajectoryElements.e = this.guiAddTrajectoryElements.settingsFolder.add(
            this.trajectorySettings, 'e', 0, 1
        ).onChange(function(value) {
            const trajectory = TRAJECTORIES[lastTrajectoryId];
            if (trajectory) {
                trajectory.e = value;
            }
        });

        this.guiAddTrajectoryElements.inc = this.guiAddTrajectoryElements.settingsFolder.add(
            this.trajectorySettings, 'inc', 0, 180
        ).onChange(function(value) {
            const trajectory = TRAJECTORIES[lastTrajectoryId];
            if (trajectory) {
                trajectory.inc = deg2rad(value);
            }
        });

        this.guiAddTrajectoryElements.raan = this.guiAddTrajectoryElements.settingsFolder.add(
            this.trajectorySettings, 'raan', 0, 360
        ).onChange(function(value) {
            const trajectory = TRAJECTORIES[lastTrajectoryId];
            if (trajectory) {
                trajectory.raan = deg2rad(value);
            }
        });

        this.guiAddTrajectoryElements.aop = this.guiAddTrajectoryElements.settingsFolder.add(
            this.trajectorySettings, 'aop', 0, 360
        ).onChange(function(value) {
            const trajectory = TRAJECTORIES[lastTrajectoryId];
            if (trajectory) {
                trajectory.aop = deg2rad(value);
            }
        });

        this.guiAddTrajectoryElements.ta = this.guiAddTrajectoryElements.settingsFolder.add(
            this.trajectorySettings, 'ta', 0, 360
        ).onChange(function(value) {
            const trajectory = TRAJECTORIES[lastTrajectoryId];
            if (trajectory) {
                trajectory.ta = deg2rad(value);
            }
        });

        this.guiAddTrajectoryElements.addTrajectoryFolder = this.guiAddTrajectory.addFolder("");

        this.guiAddTrajectoryElements.addTrajectoryFolder.add(this.trajectorySettings, 'addTrajectory');
        this.guiAddTrajectoryElements.settingsFolder.add(this.trajectorySettings, 'saveTrajectory');
        this.guiAddTrajectoryElements.addTrajectoryFolder.open();

        this.guiAddTrajectory.add(this.trajectorySettings, 'dropLastTrajectory');
        document.getElementById('leftPanel').appendChild(this.guiAddTrajectory.domElement);
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
        return this.visualModel.render(
            epoch,
            this.getPositionByEpoch(epoch, RF_BASE)
        );
    }
}

function init() {
    let objectsForTracking = {};

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000000000);
    camera.position.x = 300000000;
    camera.position.y = 300000000;
    camera.position.z = 300000000;
    camera.up = new THREE.Vector3(0, 0, 1);

    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(100000000));
    scene.add(new THREE.AmbientLight(0xFFEFD5, 0.15));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.zoomSpeed = 3;

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
        const frame = ReferenceFrame.get(trajConfig.rf.origin, trajConfig.rf.type);
        let traj;

        if (trajConfig.type === 'static') {
            traj = new TrajectoryStaticPosition(frame, new Vector3(trajConfig.data[0], trajConfig.data[1], trajConfig.data[2]));
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
                : new VisualBodyModel(
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
                    getQuaternionByEuler(
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
        const tle = new TLE(TLEDATA[id]);
        const objId = parseInt(id);

        TRAJECTORIES[objId] = new TrajectoryKeplerianOrbit(
            ReferenceFrame.get(EARTH, RF_TYPE_EQUATORIAL),
            BODIES[EARTH].physicalModel.mu,
            tle.getSma(),
            tle.getE(),
            deg2rad(tle.getInc()),
            deg2rad(tle.getRaan()),
            deg2rad(tle.getAop()),
            deg2rad(tle.getMeanAnomaly()),
            tle.getEpoch(),
            TLEDATA[id].color ? TLEDATA[id].color : 'azure',
            false
        );
    }
}

function firstRender(curTime) {
    globalTime = curTime;
    trackingCoords = TRAJECTORIES[settings.trackingObject].getPositionByEpoch(time.epoch, RF_BASE);
    requestAnimationFrame(render);
}

function render(curTime) {
    let newTrackingCoords;
    time.tick(curTime - globalTime);
    globalTime = curTime;

    newTrackingCoords = TRAJECTORIES[settings.trackingObject].getPositionByEpoch(time.epoch, RF_BASE);

    controls.object.position.x += newTrackingCoords.x - trackingCoords.x;
    controls.object.position.y += newTrackingCoords.y - trackingCoords.y;
    controls.object.position.z += newTrackingCoords.z - trackingCoords.z;

    controls.target.x = newTrackingCoords.x;
    controls.target.y = newTrackingCoords.y;
    controls.target.z = newTrackingCoords.z;

    trackingCoords = newTrackingCoords;
    controls.update();

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

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var camera, scene, renderer, controls;
var settings, time, globalTime, trackingCoords;
var textureLoader;
var lastTrajectoryId = -1;
var stars;

window.onload = function () {
    init();
    initBuiltIn();
    requestAnimationFrame(firstRender);
};
