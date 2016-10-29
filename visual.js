"use_strict";

class VisualBodyModel
{
    constructor(shape, color, texturePath) {
        this.shape = shape;   // class VisualShapeAbstract
        this.color = color;
        this.body = null; // class Body
        
        this.threeObj = new THREE.Mesh(
            this.shape.getThreeGeometry(),
            new THREE.MeshBasicMaterial({color: this.color, wireframe: true})
        );
        
        scene.add(this.threeObj);
        
        if (texturePath !== undefined) {
            var that = this;
            
            textureLoader.load(
                COMMON_TEXTURE_PATH + texturePath,
                function(txt) {
                    that.threeObj.material.dispose();
                    that.threeObj.material = new THREE.MeshBasicMaterial({map: txt}) 
                },
                null,
                function(err) { 
                    console.log(err);
                }                    
            );
        }
    }

    render(epoch) {
        var pos = this.body.getPositionByEpoch(epoch, RF_BASE);

        this.threeObj.position.set(pos.x, pos.y, pos.z);
        this.threeObj.quaternion.copy(
            this.body.orientation.getOrientationByEpoch(epoch)
        );
    }
}

class VisualShapeAbstract
{
    getThreeGeometry() {}
}

class VisualShapeSphere extends VisualShapeAbstract
{
    constructor(radius, segments) {
        super();

        this.radius = radius;
        this.threeGeometry = new THREE.SphereGeometry(radius, segments * 2, segments);
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
