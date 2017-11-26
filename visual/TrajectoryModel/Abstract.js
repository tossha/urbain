class VisualTrajectoryModelAbstract extends VisualModelAbstract
{
    constructor(trajectory, color) {
        super();

        this.trajectory = trajectory;
        this.standardColor = color;
        this.color = color;

        this.threeObj = new LineObject(
            new THREE.Geometry(),
            new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors})
        );

        this.threeObj.userData = {trajectory: trajectory};
    }

    onSceneReady() {
        super.onSceneReady();
        trajArray.push(this.threeObj);
    }

    set isSelected(newValue) {
        if(newValue) {
            this.color = 0xFFFFFF;
        }
        else {
            this.color = this.standardColor;
        }
    }

    drop()
    {
        this.scene.remove(this.threeObj);
        this.threeObj.geometry.dispose();
        this.threeObj.material.dispose();
        this.threeObj.remove();
        delete this.threeObj;
    }
}