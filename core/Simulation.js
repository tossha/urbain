class Simulation
{
    init(domElementId, starSystemConfig) {
        this.starSystem = new StarSystem(starSystemConfig.id);

        StarSystemLoader.loadFromConfig(this.starSystem, starSystemConfig);

        this.time = new TimeLine(TimeLine.getEpochByDate(new Date()), 0.001, true);

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xFFEFD5, 0.15));

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.domElement = document.getElementById(domElementId);
        this.domElement.appendChild(this.renderer.domElement);
        this.domElement.addEventListener('resize', this.onWindowResize.bind(this));

        this.rendererEvents = new EventHandler(this.renderer.domElement);

        this.camera = new Camera(this.renderer.domElement, this.starSystem.mainObject, new Vector([30000, 30000, 10000]));

        this.textureLoader = new THREE.TextureLoader();

        this.raycaster = new VisualRaycaster(this.renderer.domElement, this.camera.threeCamera, 7);

        this.selection = new SelectionHandler();

        this.ui = new UI(5, this.starSystem.getObjectNames());

        document.dispatchEvent(new CustomEvent(
            Events.LOAD_FINISH,
            {detail: {scene: this.scene}}
        ));
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

    getVisualCoords(vector) {
        return vector.sub(this.camera.lastPosition);
    }
}