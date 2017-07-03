class VisualBodyModelAbstract
{
    constructor(shape, color) {
        this.shape = shape;   // class VisualShapeAbstract
        this.color = color;
        this.body = null; // class Body

        this.threeObj = this.getThreeObj();
        this.axisHelper = new THREE.AxisHelper(shape.radius * 2);

        scene.add(this.threeObj);
        scene.add(this.axisHelper);
    }

    getThreeObj() {
        return new THREE.Mesh(
            this.shape.getThreeGeometry(),
            this.getMaterial({color: this.color, wireframe: true})
        );
    }

    getMaterial(parameters) {
        return new THREE.MeshStandardMaterial(parameters);
    }

    render(epoch, pos) {
        this.threeObj.position.fromArray(pos.sub(camera.lastPosition));
        this.threeObj.quaternion.copy(
            this.body.orientation.getQuaternionByEpoch(epoch).toThreejs()
        );
        this.axisHelper.position.copy(this.threeObj.position);
        this.axisHelper.quaternion.copy(this.threeObj.quaternion);
    }
}