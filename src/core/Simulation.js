import EventHandler from "./EventHandler";
import {Vector} from "../algebra";
import {Events} from "./Events";
import {ReferenceFrame} from "./ReferenceFrame/Factory";
import TimeLine from "./TimeLine";
import StarSystemLoader from "../interface/StarSystemLoader";
import VisualRaycaster from "../visual/VisualRaycaster";
import SelectionHandler from "../visual/SelectionHandler";
import UI from "../ui/UI";
import StarSystem from "./StarSystem";
import Camera from "./Camera";

export default class Simulation
{
    init(domElementId, starSystemConfig) {
        this.scene = new THREE.Scene();
        this.textureLoader = new THREE.TextureLoader();
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.rendererEvents = new EventHandler(this.renderer.domElement);

        this.selection = new SelectionHandler();

        this.starSystem = new StarSystem(starSystemConfig.id);

        this.time = new TimeLine(TimeLine.getEpochByDate(new Date(1516193355000 + 86400000*30*4)), 86.4 * 0.005, false);

        StarSystemLoader.loadFromConfig(this.starSystem, starSystemConfig);

        this.scene.add(new THREE.AmbientLight(0xFFEFD5, 0.15));

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.domElement = document.getElementById(domElementId);
        this.domElement.appendChild(this.renderer.domElement);
        this.domElement.addEventListener('resize', this.onWindowResize.bind(this));

        this.camera = new Camera(
            this.renderer.domElement,
            this.starSystem.getObjectReferenceFrameId(
                this.starSystem.mainObject,
                ReferenceFrame.INERTIAL_BODY_EQUATORIAL
            ),
            new Vector([30000, 30000, 10000])
        );

        this.raycaster = new VisualRaycaster(this.renderer.domElement, this.camera.threeCamera, 7);

        this.ui = new UI(5, this.starSystem.getObjectNames());

        StarSystemLoader.loadObjectByUrl(sim.starSystem, '/spacecraft/voyager1.json');
        StarSystemLoader.loadObjectByUrl(sim.starSystem, '/spacecraft/voyager2.json');
        StarSystemLoader.loadObjectByUrl(sim.starSystem, '/spacecraft/lro.json');
    }

    get currentEpoch() {
        return this.time.epoch;
    }

    addEventListener(eventName, listener, priority) {
        this.rendererEvents.addListener(eventName, listener, priority);
    }

    removeEventListener(eventName, listener) {
        this.rendererEvents.removeListener(eventName, listener);
    }

    onWindowResize() {
        this.renderer.setSize(this.domElement.innerWidth, this.domElement.innerHeight);
        this.camera.onResize();
    }

    tick(timeDelta) {
        this.time.tick(timeDelta);

        this.camera.update(this.time.epoch);

        document.dispatchEvent(new CustomEvent(
            Events.RENDER,
            {detail: {epoch: this.time.epoch}}
        ));

        this.renderer.render(this.scene, this.camera.threeCamera);
    }

    getVisualCoords(simCoords) {
        return (new THREE.Vector3()).fromArray(simCoords.sub(this.camera.lastPosition));
    }
}