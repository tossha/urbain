
class VisualBodyModel
{
    constructor(shape, texture) {
        this.shape   = shape;   // class VisualShapeAbstract
        this.texture = texture;

        this.body = null; // class Body

        this.threeObj = new THREE.Mesh(
            this.shape.getThreeGeometry(),
            new THREE.MeshBasicMaterial({color: this.texture, wireframe: true})
        );
        scene.add(this.threeObj);
    }

    render(epoch) {
        var pos = this.body.getPositionByEpoch(epoch);
        this.threeObj.position.set(pos.x, pos.y, pos.z);
    }
}

class VisualShapeAbstract
{
    getThreeGeometry() {}
}

class VisualShapeSphere extends VisualShapeAbstract
{
    constructor(radius) {
        this.radius = radius;
        this.threeGeometry = new THREE.SphereGeometry(this.size, 16, 8);
        this.threeGeometry.rotateX(Math.PI / 2);
    }

    getThreeGeometry() {
        return this.threeGeometry;
    }
}

class VisualShapeModel extends VisualShapeAbstract
{
    constructor(modelFile) {
        this.modelFile = modelFile;
    }

    getThreeGeometry() {
        // @todo implement
    }
}
