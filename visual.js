"use_strict";
const CommonTetxurePath = '../texture/';
var   loader = new THREE.TextureLoader;

class VisualBodyModel
{
    constructor(shape, color, texturePath) {
        this.shape = shape;   // class VisualShapeAbstract
        this.color = color;

        this.body = null; // class Body
		
		this.texture = null;
		this.material = new THREE.MeshBasicMaterial( {color: this.color, wireframe: true} );
		
		this.threeObj = new THREE.Mesh(
            this.shape.getThreeGeometry(),
            this.material
        );
		
        scene.add(this.threeObj);
		
		if(texturePath !== undefined){
			var that = this;
			
			loader.load(
				CommonTetxurePath + texturePath,
				function( txt ) { that.threeObj.material = new THREE.MeshBasicMaterial( {map: txt} ) },
				function(     ) {                                                                    },
				function( err ) { console.log(err);                                                  }
			);
		}
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
