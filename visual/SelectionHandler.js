class SelectionHandler
{
    constructor(raycaster) {
        this.selectionRaycaster = raycaster;
        this.selectedObject = null;
        this.bestIntersection = null;

        this.testSphere = new THREE.Mesh(
            new THREE.SphereGeometry(1, 10, 10),
            new THREE.MeshBasicMaterial({color: 0xffff00})
        );

        scene.add(this.testSphere);

        document.addEventListener('vr_render', this.onRender.bind(this));
        window.addEventListener('click', this.onMoueClick.bind(this));
    }

    onRender() {
        const intersections = this.selectionRaycaster.intersectObjects(trajArray);

        if(intersections.length > 0) {
            this.bestIntersection = intersections[0];

            for(var i = 1; i < intersections.length; i++) { 
                if(intersections[i].distance < this.bestIntersection.distance) {
                    this.bestIntersection = intersections[i];
                }
            }

            this.testSphere.visible = true;
            this.testSphere.position.copy(this.bestIntersection.point);

            const scaleKoeff = this.bestIntersection.point.length() / 200;

            this.testSphere.scale.x = scaleKoeff;
            this.testSphere.scale.y = scaleKoeff;
            this.testSphere.scale.z = scaleKoeff;
        }
        else {
            this.testSphere.visible = false;
            this.bestIntersection = null;
        }
    }

    onMoueClick() {
        if(this.bestIntersection) {
            const currentTraj = this.bestIntersection.object.userData.trajectory;

            if(currentTraj == this.selectedObject) {
                currentTraj.isSelected = false;
                this.selectedObject = null;
            }
            else {
                if(this.selectedObject) {
                    this.selectedObject.isSelected = false;
                }

                this.selectedObject = currentTraj;
                currentTraj.isSelected = true;
            }
        }
    }

    getSelectedObjects() {
        return this.selectedObject;
    }
}
