class SelectionHandler
{
    constructor(scene, raycaster) {
        this.selectionRaycaster = raycaster;
        this.selectedObject = null;
        this.bestIntersection = null;

        this.pointerSphere = new THREE.Mesh(
            new THREE.SphereGeometry(1, 10, 10),
            new THREE.MeshBasicMaterial({color: 0xFFFF00})
        );

        scene.add(this.pointerSphere);

        document.addEventListener(Events.RENDER, this.onRender.bind(this));
        rendererEvents.addListener('click', this.onMouseClick.bind(this), 1);
        rendererEvents.addListener('mousedown', this.onMouseDown.bind(this), 1);

        this.mouseMoveListener = this.onMouseMove.bind(this);
    }

    onRender() {
        const intersections = this.selectionRaycaster.intersectObjects(trajArray);

        if (intersections.length > 0) {
            this.bestIntersection = intersections[0];

            for(var i = 1; i < intersections.length; i++) { 
                if (intersections[i].distance < this.bestIntersection.distance) {
                    this.bestIntersection = intersections[i];
                }
            }

            this.pointerSphere.visible = true;
            this.pointerSphere.position.copy(this.bestIntersection.point);

            const scaleKoeff = this.bestIntersection.point.length() / 200;

            this.pointerSphere.scale.x = scaleKoeff;
            this.pointerSphere.scale.y = scaleKoeff;
            this.pointerSphere.scale.z = scaleKoeff;
        }
        else {
            this.pointerSphere.visible = false;
            this.bestIntersection = null;
        }
    }

    onMouseDown(event) {
        if ((event.button === 0) && (this.selectedObject) && (!this.bestIntersection)) {
            document.addEventListener('mousemove', this.mouseMoveListener);
        }

        this.mouse = new THREE.Vector2((event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
    }

    onMouseMove() {
        this.hasMouseMoved = true;
    }

    onMouseClick() {
        if (this.bestIntersection) {
            const currentTraj = this.bestIntersection.object.userData.trajectory;
            let newMouse = new THREE.Vector2((event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);

            if ((Math.abs(this.mouse.x - newMouse.x) < 1e-8) && (Math.abs(this.mouse.y - newMouse.y) < 1e-8)) {
                if (currentTraj === this.selectedObject) {
                    this.dispatchVRDeselect();
                } else {
                    if (this.selectedObject) {
                        this.dispatchVRDeselect();
                    }

                    this.selectedObject = currentTraj;
                    currentTraj.isSelected = true;

                    document.dispatchEvent(new CustomEvent(
                        Events.SELECT,
                        {detail: {trajectory: this.selectedObject}}
                    ));
                }
            }
        } else {
            if ((this.selectedObject) && (!this.hasMouseMoved)) {
                this.dispatchVRDeselect();
            }
            document.removeEventListener('mousemove', this.mouseMoveListener);
            this.hasMouseMoved = false;
        }
    }

    getSelectedObject() {
        return this.selectedObject;
    }

    dispatchVRDeselect() {
        document.dispatchEvent(new CustomEvent(
            Events.DESELECT,
            {detail: {trajectory: this.selectedObject}}
        ));

        this.selectedObject.isSelected = false;
        this.selectedObject = null;
    }
}
