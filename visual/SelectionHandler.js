class SelectionHandler
{
    constructor(raycaster) {
        this.selectionRaycaster = raycaster;
        this.selectedObject = null;
        this.bestIntersection = null;

        this.pointerSphere = new THREE.Mesh(
            new THREE.SphereGeometry(1, 10, 10),
            new THREE.MeshBasicMaterial({color: 0xFFFF00})
        );

        scene.add(this.pointerSphere);

        document.addEventListener('vr_render', this.onRender.bind(this));
        window.addEventListener('click', this.onMouseClick.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));

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
            window.addEventListener('mousemove', this.mouseMoveListener);
        }
    }

    onMouseMove() {
        this.hasMouseMoved = true;
    }

    onMouseClick() {
        if (this.bestIntersection) {
            const currentTraj = this.bestIntersection.object.userData.trajectory;

            if (currentTraj === this.selectedObject) {
                currentTraj.isSelected = false;

                document.dispatchEvent(new CustomEvent(
                    'vr_deselect',
                    {detail: {trajectory: this.selectedObject}}
                ));

                this.selectedObject = null;
            }
            else {
                if (this.selectedObject) {
                    this.selectedObject.isSelected = false;

                    document.dispatchEvent(new CustomEvent(
                        'vr_deselect',
                        {detail: {trajectory: this.selectedObject}}
                    ));
                }

                this.selectedObject = currentTraj;
                currentTraj.isSelected = true;

                document.dispatchEvent(new CustomEvent(
                    'vr_select',
                    {detail: {trajectory: this.selectedObject}}
                ));
            }
        } else {
            if ((this.selectedObject) && (!this.hasMouseMoved)) {
                this.selectedObject.isSelected = false;
                this.selectedObject = null;

                document.dispatchEvent(new CustomEvent(
                    'vr_deselect',
                    {detail: {trajectory: this.selectedObject}}
                ));
            };

            window.removeEventListener('mousemove', this.mouseMoveListener);
            this.hasMouseMoved = false;
        }
    }

    getSelectedObject() {
        return this.selectedObject;
    }
}
