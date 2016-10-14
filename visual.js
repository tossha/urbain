"use_strict";

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
        var pos = this.body.getPositionByEpoch(epoch, RF_BASE);
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
        super();

        this.radius = radius;
        this.threeGeometry = new THREE.SphereGeometry(radius, 16, 8);
        this.threeGeometry.rotateX(Math.PI / 2);
    }

    getThreeGeometry() {
        return this.threeGeometry;
    }
}

class VisualShapeModel extends VisualShapeAbstract
{
    constructor(modelFile) {
        super();
        
        this.modelFile = modelFile;
    }

    getThreeGeometry() {
        // @todo implement
    }
}
