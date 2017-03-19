class VisualRaycaster
{
    constructor(threeCamera, pixelPrecision) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.camera = threeCamera;

        this.setPixelPrecision(pixelPrecision);
        this.updatePixelAngleSize();

        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('resize', this.updatePixelAngleSize.bind(this));
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    setPixelPrecision(value) {
        this.raycaster.pixelPrecision = value;
    }

    updatePixelAngleSize() {
        this.raycaster.pixelAngleSize = deg2rad(this.camera.fov) / window.innerHeight;
    }

    intersectObjects(threeObjects) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        return this.raycaster.intersectObjects(threeObjects);
    }
}