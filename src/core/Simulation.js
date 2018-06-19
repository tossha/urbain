import EventHandler from "./EventHandler";
import {Vector} from "../algebra";
import Events from "./Events";
import {ReferenceFrame} from "./ReferenceFrame/Factory";
import TimeLine from "../ui/TimeLine";
import StarSystemLoader from "../interface/StarSystemLoader";
import VisualRaycaster from "../visual/Raycaster";
import SelectionHandler from "../ui/SelectionHandler";
import UI from "../ui/UI";
import StarSystem from "./StarSystem";
import Camera from "../ui/Camera";
import ReferenceFrameFactory from "./ReferenceFrame/Factory";

export default class Simulation
{
    constructor() {
        this.initSettings();
    }

    init(domElementId, starSystemConfig) {
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xFFEFD5, 0.15));

        this.textureLoader = new THREE.TextureLoader();

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.domElement = document.getElementById(domElementId);
        this.domElement.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.onWindowResize.bind(this));

        this.rendererEvents = new EventHandler(this.renderer.domElement);

        this.selection = new SelectionHandler();

        this.starSystem = new StarSystem(starSystemConfig.id);

        this.time = new TimeLine(TimeLine.getEpochByDate(new Date()), 1, true);

        StarSystemLoader.loadFromConfig(this.starSystem, starSystemConfig);

        this.camera = new Camera(
            this.renderer.domElement,
            ReferenceFrameFactory.buildId(
                this.starSystem.mainObject,
                ReferenceFrame.INERTIAL_BODY_EQUATORIAL
            ),
            new Vector([30000, 30000, 10000])
        );

        this.raycaster = new VisualRaycaster(this.renderer.domElement, this.camera.threeCamera, 7);

        this.ui = new UI();

        Events.dispatch(Events.INIT_DONE);

        StarSystemLoader.loadObjectByUrl(this.starSystem, './spacecraft/voyager1.json');
        StarSystemLoader.loadObjectByUrl(this.starSystem, './spacecraft/voyager2.json');
        StarSystemLoader.loadObjectByUrl(this.starSystem, './spacecraft/lro.json');
        StarSystemLoader.loadTLE(this.starSystem, 25544); // ISS
        StarSystemLoader.loadTLE(this.starSystem, 20580); // Hubble
    }

    get currentEpoch() {
        return this.time.epoch;
    }

    get currentDate() {
        return TimeLine.getDateByEpoch(this.time.epoch);
    }

    initSettings() {
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

        this.renderer.render(this.scene, this.camera.threeCamera);
    }

    getVisualCoords(simCoords) {
        return (new THREE.Vector3()).fromArray(simCoords.sub(this.camera.lastPosition));
    }
}