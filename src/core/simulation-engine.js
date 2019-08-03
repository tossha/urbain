import * as THREE from "three";
import EventHandler from "./EventHandler";
import { Vector } from "./algebra";
import Events from "./Events";
import ReferenceFrameFactory, { ReferenceFrame } from "./ReferenceFrame/Factory";
import TimeLine from "../ui-legacy/TimeLine";
import VisualRaycaster from "./visual/Raycaster";
import SelectionHandler from "../ui-legacy/SelectionHandler";
import UI from "../ui-legacy/UI";
import Camera from "../ui-legacy/Camera";
import VisualFlightEventImpulsiveBurn from "./visual/FlightEvent/ImpulsiveBurn";
import VisualMarkerApocenter from "./visual/Marker/Apocenter";
import VisualMarkerPericenter from "./visual/Marker/Pericenter";
import PatchedConics from "./PatchedConics/PatchedConics";

/**
 * @property {TimeLine} time
 * @property {THREE.TextureLoader} textureLoader
 */
class SimulationEngine {
    /**
     * @param {SimulationModel} simulationModel
     * @param {StatisticsModel} statisticsModel
     */
    constructor(simulationModel, statisticsModel) {
        if (!simulationModel) {
            throw new Error("SimulationModel must be initialized");
        }

        this._simulationModel = simulationModel;
        this._statisticsModel = statisticsModel;
        this._timeModel = simulationModel.timeModel;

        this.propagators = {};

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xFFEFD5, 0.15));
        this.textureLoader = new THREE.TextureLoader();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });

        this.rendererEvents = new EventHandler(this.renderer.domElement);
        this.selection = new SelectionHandler(this);

        this.patchedConics = new PatchedConics(this);

        Events.addListener(Events.FIRST_RENDER,() => requestAnimationFrame(this._firstRender));
    }

    startRenderLoop(viewportElement) {
        if (!viewportElement) {
            throw new Error("viewport DOM element must be created before start rendering");
        }

        this.viewportDomElement = viewportElement;
        this._setRenderSize();
        this.viewportDomElement.appendChild(this.renderer.domElement);

        this.camera = new Camera(this.renderer.domElement, this);
        this.raycaster = new VisualRaycaster(this, this.renderer.domElement, this.camera.threeCamera, /* pixelPrecision */ 7);
        this.time = new TimeLine(0, this._simulationModel.timeModel, this._activeUniverse);
        this.ui = new UI(this, this._activeUniverse);

        this.patchedConics.init();
        this._preloadTexture();
    }

    stopSimulation() {
        this._simulationModel.stopSimulation();
    }

    /* TODO: Move out this method and use Events to subscribe StarSystem changing */
    loadStarSystem(newStarSystem, onLoadFinish) {
        this._simulationModel.stopSimulation();
        this.selection.deselect();

        this._activeUniverse.changeStarSystem(newStarSystem);

        onLoadFinish && onLoadFinish(newStarSystem);

        this.camera.init(
            ReferenceFrameFactory.buildId(
                this.starSystem.mainObject,
                ReferenceFrame.INERTIAL_BODY_EQUATORIAL
            ),
            new Vector([30000, 30000, 20000])
        );

        Events.dispatch(Events.STAR_SYSTEM_LOADED, {starSystem: newStarSystem});

        this._simulationModel.startSimulation();
    }

    forceEpoch(epoch) {
        return this._timeModel.forceEpoch(epoch);
    }

    addEventListener(eventName, listener, priority) {
        this.rendererEvents.addListener(eventName, listener, priority);
    }

    removeEventListener(eventName, listener) {
        this.rendererEvents.removeListener(eventName, listener);
    }

    getVisualCoords(simCoords) {
        return (new THREE.Vector3()).fromArray(simCoords.sub(this.camera.lastPosition));
    }

    getSimCoords(visualCoords) {
        return (new Vector(visualCoords.toArray())).add_(this.camera.lastPosition);
    }

    addPropagator(alias, propagatorClass) {
        this.propagators[alias] = propagatorClass;
    }

    getPropagator(alias) {
        return this.propagators[alias];
    }

    onWindowResize = () => {
        this._setRenderSize();
        this.camera.onResize();
    };

    get currentEpoch() {
        return this._timeModel.epoch;
    }

    get currentDate() {
        return this._activeUniverse.dataTransforms.getDateByEpoch(this._timeModel.epoch);
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

    get starSystem() {
        return this._activeUniverse.activeStarSystem;
    }

    /**
     * @return {Universe}
     */
    get _activeUniverse() {
        return this._simulationModel.activeUniverse;
    }

    _render = curTime => {
        if (!this._simulationModel.isSimulationActive) {
            return;
        }

        this._tick((curTime - this._timeModel.globalTime) / 1000);

        this._timeModel.setGlobalTime(curTime);
        this._statisticsModel.updateStatistics();

        requestAnimationFrame(this._render);
    };

    _firstRender = curTime => {
        this._timeModel.setGlobalTime(curTime);
        requestAnimationFrame(this._render);
    };

    _tick(timeDelta) {
        this.time.tick(timeDelta);
        this.camera.update(this._timeModel.epoch);

        Events.dispatch(Events.RENDER, {epoch: this._timeModel.epoch});

        if (this._simulationModel.isSimulationActive) {
            this.renderer.render(this.scene, this.camera.threeCamera);
        }
    }


    _setRenderSize() {
        if(!this._footerDomElement) {
            this._footerDomElement = document.getElementById("app-footer");
        }

        const footerHeight = (this._footerDomElement ? this._footerDomElement.clientHeight : 0);
        const height = window.innerHeight - footerHeight;

        this.renderer.setSize(this.viewportDomElement.clientWidth, height);
    }

    _preloadTexture() {
        VisualFlightEventImpulsiveBurn.preloadTexture(this.textureLoader);
        VisualMarkerPericenter.preloadTexture(this.textureLoader);
        VisualMarkerApocenter.preloadTexture(this.textureLoader);
        this.patchedConics.preloadTexture();
    }
}

/**
 * @type {SimulationEngine | null}
 */
export let sim = null;

/**
 * @param {SimulationModel} simulationModel
 * @param {StatisticsModel} statisticsModel
 * @return {SimulationEngine}
 */
export function createSimulationEngine(simulationModel, statisticsModel) {
    sim = new SimulationEngine(simulationModel, statisticsModel);

    return sim;
}
