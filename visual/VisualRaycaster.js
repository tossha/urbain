class VisualRaycaster
{
    constructor(domElement, threeCamera, pixelPrecision) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.camera = threeCamera;
        this.domElement = domElement;

        this.setPixelPrecision(pixelPrecision);
        this.updatePixelAngleSize();

        this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.domElement.addEventListener('resize', this.updatePixelAngleSize.bind(this));
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / this.domElement.width) * 2 - 1;
        this.mouse.y = -(event.clientY / this.domElement.height) * 2 + 1;
    }

    setPixelPrecision(value) {
        this.raycaster.pixelPrecision = value;
    }
    
    updatePixelAngleSize() {
        this.raycaster.pixelAngleSize = deg2rad(this.camera.fov) / this.domElement.height;
    }

    getPixelAngleSize() {
        return this.raycaster.pixelAngleSize;
    }

    intersectObjects(threeObjects) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        return this.raycaster.intersectObjects(threeObjects);
    }

    getPixelDistance(point) {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const pointDirection = (new THREE.Vector3).subVectors(
            point,
            sim.camera.lastPosition
        );

        const angle = Math.acos(
            this.raycaster.ray.direction.dot(pointDirection) / pointDirection.length()
        );

        return angle / this.raycaster.pixelAngleSize;
    }
}