class VisualBodyModelAbstract extends VisualModelAbstract
{
    constructor(shape, color) {
        super();

        this.shape = shape;   // class VisualShapeAbstract
        this.color = color;
        this.body = null; // class Body

        this.threeObj = this.getThreeObj();
        this.threeObj.add(new THREE.AxisHelper(shape.radius * 2));
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

    render(epoch) {
        this.threeObj.position.fromArray(sim.getVisualCoords(body.getPositionByEpoch(epoch)));
        this.threeObj.quaternion.copy(
            this.body.orientation.getQuaternionByEpoch(epoch).toThreejs()
        );
    }
}