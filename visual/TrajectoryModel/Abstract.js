class VisualTrajectoryModelAbstract
{
    constructor(trajectory, color) {
        this.trajectory = trajectory;
        this.color = color;

        this.threeObj = new THREE.Line(
            new THREE.Geometry(),
            new THREE.LineBasicMaterial({color: this.color, vertexColors: THREE.VertexColors})
        );

        scene.add(this.threeObj);
    }

    drop()
    {
        scene.remove(this.threeObj);
        this.threeObj.geometry.dispose();
        this.threeObj.material.dispose();
        delete this.threeObj;
    }

    render(epoch) {}
}