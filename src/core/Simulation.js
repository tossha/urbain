import * as THREE from "three";

import EventHandler from "./EventHandler";
import {Vector} from "./algebra";
import Events from "./Events";
import {ReferenceFrame} from "./ReferenceFrame/Factory";
import TimeLine from "../ui-legacy/TimeLine";
import StarSystemLoader from "../interface/StarSystemLoader";
import VisualRaycaster from "./visual/Raycaster";
import SelectionHandler from "../ui-legacy/SelectionHandler";
import UI from "../ui-legacy/UI";
import StarSystem from "./StarSystem";
import Camera from "../ui-legacy/Camera";
import ReferenceFrameFactory from "./ReferenceFrame/Factory";

class Simulation
{
    constructor() {
        this.modules = {};
        this.propagators = {};
        this.renderLoopActive = false;

        this._initSettings();
    }

    init(viewPortDomElement, renderLoopFunction) {
        this.renderLoopFunction = renderLoopFunction;

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xFFEFD5, 0.15));

        this.textureLoader = new THREE.TextureLoader();

        this.renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.domElement = viewPortDomElement;
        this.domElement.appendChild(this.renderer.domElement);
        window.addEventListener("resize", this.onWindowResize.bind(this));

        this.rendererEvents = new EventHandler(this.renderer.domElement);

        this.selection = new SelectionHandler();

        this.time = new TimeLine(TimeLine.getEpochByDate(new Date()), 1, true);

        this.camera = new Camera(this.renderer.domElement);

        this.raycaster = new VisualRaycaster(this.renderer.domElement, this.camera.threeCamera, 7);

        this.ui = new UI();

        Events.dispatch(Events.INIT_DONE);
    }

    loadStarSystem(starSystemConfig) {
        this.starSystem = new StarSystem(starSystemConfig.id);

        StarSystemLoader.loadFromConfig(this.starSystem, starSystemConfig);

        this.camera.init(
            ReferenceFrameFactory.buildId(
                this.starSystem.mainObject,
                ReferenceFrame.INERTIAL_BODY_EQUATORIAL
            ),
            new Vector([30000, 30000, 20000])
        );

        StarSystemLoader.loadObjectByUrl(this.starSystem, './spacecraft/voyager1.json');
        StarSystemLoader.loadObjectByUrl(this.starSystem, './spacecraft/voyager2.json');
        StarSystemLoader.loadObjectByUrl(this.starSystem, './spacecraft/lro.json');
        StarSystemLoader.loadTLE(this.starSystem, 25544); // ISS
        StarSystemLoader.loadTLE(this.starSystem, 20580); // Hubble

        Events.dispatch(Events.STAR_SYSTEM_LOADED, {starSystem: this.starSystem});

        this.startRendering();
    }

    startRendering() {
        this.renderLoopActive = true;
        requestAnimationFrame(this.renderLoopFunction);
    }

    stopRendering() {
        this.renderLoopActive = false;
    }

    get currentEpoch() {
        return this.time.epoch;
    }

    get currentDate() {
        return TimeLine.getDateByEpoch(this.time.epoch);
    }

    _initSettings() {
        this.settings = {
            ui: {
                showBodyLabels: true,
                showAnglesOfSelectedOrbit: true,
                camera: {
                    mouseSensitivity: 0.007,
                    zoomFactor: 1.5
                }
            }
        }
    }

    addEventListener(eventName, listener, priority) {
        this.rendererEvents.addListener(eventName, listener, priority);
    }

    removeEventListener(eventName, listener) {
        this.rendererEvents.removeListener(eventName, listener);
    }

    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.onResize();
    }

    tick(timeDelta) {
        this.time.tick(timeDelta);

        this.camera.update(this.time.epoch);

        Events.dispatch(Events.RENDER, {epoch: this.time.epoch});

        if (this.renderLoopActive) {
            this.renderer.render(this.scene, this.camera.threeCamera);
        }
    }

    getVisualCoords(simCoords) {
        return (new THREE.Vector3()).fromArray(simCoords.sub(this.camera.lastPosition));
    }

    getSimCoords(visualCoords) {
        return (new Vector(visualCoords.toArray())).add_(this.camera.lastPosition);
    }

    loadModule(alias) {
        const name = alias.charAt(0).toUpperCase() + alias.slice(1);
        const className = 'Module' + name;
        import('../modules/' + name + '/' + className).then((module) => {
            this.modules[alias] = new module.default();
            this.modules[alias].init();
        });
    }

    addPropagator(alias, propagatorClass) {
        this.propagators[alias] = propagatorClass;
    }

    getPropagator(alias) {
        return this.propagators[alias];
    }
}

export const sim = new Simulation();
