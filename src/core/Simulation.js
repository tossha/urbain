import * as THREE from "three";
import $ from "jquery";
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
import StarSystemManager from "../interface/StarSystemManager";

class Simulation
{
    constructor() {
        this.modules = {};
        this.propagators = {};
        this.renderLoopActive = false;
        this.starSystemManager = new StarSystemManager();

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

        this.time = new TimeLine(0, 1, true);

        this.camera = new Camera(this.renderer.domElement);

        this.raycaster = new VisualRaycaster(this.renderer.domElement, this.camera.threeCamera, 7);

        this.ui = new UI();

        this.starSystemManager.loadDefault();

        Events.dispatch(Events.INIT_DONE);
    }

    loadStarSystem(jsonFile, onLoadFinish) {
        $.getJSON("./star_systems/" + jsonFile, starSystemConfig => {
            this.starSystem && this.starSystem.unload();
            this.starSystem = new StarSystem(starSystemConfig.id);

            StarSystemLoader.loadFromConfig(this.starSystem, starSystemConfig);

            this.camera.init(
                ReferenceFrameFactory.buildId(
                    this.starSystem.mainObject,
                    ReferenceFrame.INERTIAL_BODY_EQUATORIAL
                ),
                new Vector([30000, 30000, 20000])
            );

            onLoadFinish && onLoadFinish(this.starSystem);
            Events.dispatch(Events.STAR_SYSTEM_LOADED, {starSystem: this.starSystem});

            this.startRendering();
        });
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
        return this.time.getDateByEpoch(this.time.epoch);
    }

    forceEpoch(epoch) {
        return this.time.forceEpoch(epoch);
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

    loadModule(alias, callback) {
        const className = 'Module' + alias;
        import('../modules/' + alias + '/' + className).then((module) => {
            this.modules[alias] = new module.default();
            this.modules[alias].init();
            callback && callback(this.modules[alias]);
        });
    }

    getModule(alias) {
        if (this.modules[alias] === undefined) {
            throw new Error('Unknown module: ' + alias);
        }
        return this.modules[alias];
    }

    isModuleLoaded(alias) {
        return this.modules[alias] !== undefined;
    }

    getClass(alias) {
        const periodPos = alias.indexOf(".");
        if (periodPos === -1) {
            throw new Error('Incorrect class alias! Period expected in ' + alias);
        }
        return this.getModule(alias.substr(0, periodPos)).getClass(alias.substr(periodPos + 1));
    }

    addPropagator(alias, propagatorClass) {
        this.propagators[alias] = propagatorClass;
    }

    getPropagator(alias) {
        return this.propagators[alias];
    }
}

export const sim = new Simulation();
