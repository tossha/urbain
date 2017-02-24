class VisualRaycaster
{
    constructor(threeCamera) {
        let that = this;
        window.addEventListener('mousemove', function (event) {
            that.onMouseMove(event);
        });

        this.mouse = new THREE.Vector2();
        this.camera = threeCamera;
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    intersectObjects(threeObjects) {
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.mouse, this.camera);
        return raycaster.intersectObjects(threeObjects);
    }
}