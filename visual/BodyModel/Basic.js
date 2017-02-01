class VisualBodyModelBasic
{
    constructor(shape, color, texturePath) {
        this.shape = shape;   // class VisualShapeAbstract
        this.color = color;
        this.body = null; // class Body

        this.threeObj = new THREE.Mesh(
            this.shape.getThreeGeometry(),
            this.getMaterial({color: this.color, wireframe: true})
        );

        this.axisHelper = new THREE.AxisHelper(shape.radius * 2);

        scene.add(this.threeObj);
        scene.add(this.axisHelper);

        if (texturePath !== undefined) {
            var that = this;

            textureLoader.load(
                COMMON_TEXTURE_PATH + texturePath,
                function(txt) {
                    that.threeObj.material.dispose();
                    that.threeObj.material = that.getMaterial({map: txt});
                },
                undefined,
                function(err) {
                    console.log(err);
                }
            );
        }
    }

    getMaterial(parameters) {
        parameters.metalness = 0;
        parameters.roughness = 1;
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