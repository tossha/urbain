import * as THREE from "three";
import $ from "jquery";
import EventHandler from "./EventHandler";
import { Vector } from "./algebra";
import Events from "./Events";
import ReferenceFrameFactory, { ReferenceFrame } from "./ReferenceFrame/Factory";
import TimeLine from "../ui-legacy/TimeLine";
import StarSystemLoader from "../interface/StarSystemLoader";
import VisualRaycaster from "./visual/Raycaster";
import SelectionHandler from "../ui-legacy/SelectionHandler";
import UI from "../ui-legacy/UI";
import StarSystem from "./StarSystem";
import Camera from "../ui-legacy/Camera";
import StarSystemManager from "../interface/StarSystemManager";
import VisualFlightEventImpulsiveBurn from "./visual/FlightEvent/ImpulsiveBurn";
import VisualMarkerApocenter from "./visual/Marker/Apocenter";
import VisualMarkerPericenter from "./visual/Marker/Pericenter";


class Simulation {
    constructor() {
        this.modules = {};
        this.propagators = {};
        this.renderLoopActive = false;
        this.starSystemManager = new StarSystemManager();
    }

    /**
     * @param {SimulationModel} simulationModel
     * @param {function} renderLoopFunction
     */
    init(simulationModel, renderLoopFunction) {
        this._simulationModel = simulationModel;
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xFFEFD5, 0.15));

        this.textureLoader = new THREE.TextureLoader();

        this.renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});

        this.domElement = document.getElementById(this._simulationModel.viewportId);
        this._setRenderSize();
        this.domElement.appendChild(this.renderer.domElement);
        window.addEventListener("resize", this.onWindowResize.bind(this));

        this.rendererEvents = new EventHandler(this.renderer.domElement);

        this.selection = new SelectionHandler();

        this.time = new TimeLine(0, 1, true);

        this.camera = new Camera(this.renderer.domElement);

        this.raycaster = new VisualRaycaster(this.renderer.domElement, this.camera.threeCamera, 7);

        this.ui = new UI();

        this.starSystemManager.loadDefault(() => requestAnimationFrame(renderLoopFunction));

        VisualFlightEventImpulsiveBurn.preloadTexture();
        VisualMarkerPericenter.preloadTexture();
        VisualMarkerApocenter.preloadTexture();

        Events.dispatch(Events.INIT_DONE);
    }

    loadStarSystem(jsonFile, onLoadFinish) {
        return Promise.resolve($.getJSON("./star_systems/" + jsonFile, starSystemConfig => {
            this.selection.deselect();
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
        }));
    }

    startRendering() {
        this.renderLoopActive = true;
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

    get settings() {
        const showBodyLabels = this._simulationModel ? this._simulationModel.isBodyLabelsVisible : true;

        return {
            ui: {
                showBodyLabels,
                showAnglesOfSelectedOrbit: true,
                camera: {
                    mouseSensitivity: 0.007,
                    zoomFactor: 1.5
                }
            }
        }
    };

    forceEpoch(epoch) {
        return this.time.forceEpoch(epoch);
    }

    addEventListener(eventName, listener, priority) {
        this.rendererEvents.addListener(eventName, listener, priority);
    }

    removeEventListener(eventName, listener) {
        this.rendererEvents.removeListener(eventName, listener);
    }

    onWindowResize() {
        this._setRenderSize();
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

    /**
     * @param moduleName
     * @param callback
     * @return {Promise}
     */
    loadModule(moduleName, callback) {
        const className = 'Module' + moduleName;

        return import('../modules/' + moduleName + '/' + className).then((module) => {
            this.modules[moduleName] = new module.default();
            this.modules[moduleName].init();
            callback && callback(this.modules[moduleName]);
        });
    }

    getModule(moduleName) {
        if (this.modules[moduleName] === undefined) {
            throw new Error('Unknown module: ' + moduleName);
        }

        return this.modules[moduleName];
    }

    isModuleLoaded(moduleName) {
        return this.modules[moduleName] !== undefined;
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

    _setRenderSize() {
        if(!this._footerDomElement) {
            this._footerDomElement = document.getElementById("app-footer");
        }

        const footerHeight = (this._footerDomElement ? this._footerDomElement.clientHeight : 0);
        const height = window.innerHeight - footerHeight;

        this.renderer.setSize(this.domElement.clientWidth, height);
    }
}

export const sim = new Simulation();
