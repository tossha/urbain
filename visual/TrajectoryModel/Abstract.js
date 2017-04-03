class VisualTrajectoryModelAbstract
{
    constructor(trajectory, color) {
        this.trajectory = trajectory;
        this.standardColor = color;
        this.color = color;

        this.threeObj = new LineObject(
            new THREE.Geometry(),
            new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors})
        );

        this.threeObj.userData = {trajectory: trajectory};

        scene.add(this.threeObj);

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
        scene.remove(this.threeObj);
        this.threeObj.geometry.dispose();
        this.threeObj.material.dispose();
        delete this.threeObj;
    }

    render(epoch) {}
}