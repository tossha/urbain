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

    onLoadFinish() {
        super.onLoadFinish();
        sim.selection.addSelectableObject(this.threeObj);
    }

    select() {
        this.color = 0xFFFFFF;
    }

    deselect() {
        this.color = this.standardColor;
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