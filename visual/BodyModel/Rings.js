class VisualBodyModelRings extends VisualBodyModelAbstract
{
    constructor(shape, color, texturePath, ringsColorMapPath, ringsAlphaMapPath){
        super(shape, color);

        if (texturePath) {
            var that = this;

            textureLoader.load(
                COMMON_TEXTURE_PATH + texturePath,
                function(txt) {
                    that.bodyThreeObj.material.dispose();
                    that.bodyThreeObj.material = that.getMaterial({map: txt});
                },
                undefined,
                function(err) {
                    console.log(err);
                }
            );
        }

        if (ringsColorMapPath) {
            var that = this;

            textureLoader.load(
                COMMON_TEXTURE_PATH + ringsColorMapPath,
                function(txt) {
                    that.ringsColorMap = txt;
                    that.updateRingsMaterial();
                },
                undefined,
                function(err) {
                    console.log(err);
                }
            );
        }

        if (ringsAlphaMapPath) {
            var that = this;

            textureLoader.load(
                COMMON_TEXTURE_PATH + ringsAlphaMapPath,
                function(txt) {
                    that.ringsAlphaMap = txt;
                    that.updateRingsMaterial();
                },
                undefined,
                function(err) {
                    console.log(err);
                }
            );
        }        
    }

    getThreeObj() {
        let container = new THREE.Object3D();

        this.bodyThreeObj = new THREE.Mesh(
            this.shape.getThreeGeometry(),
            this.getMaterial({color: this.color, wireframe: true})
        );

        this.ringsThreeObj = new THREE.Mesh(
            new THREE.CircleGeometry(137316, 32),
            this.getMaterial({color: this.color, wireframe: true})
        );

        container.add(this.bodyThreeObj);
        container.add(this.ringsThreeObj);

        return container;
    }

    updateRingsMaterial() {
        if(this.ringsColorMap && this.ringsAlphaMap) {
            this.ringsThreeObj.material.dispose();
            this.ringsThreeObj.material = this.getMaterial({
                map: this.ringsColorMap,
                alphaMap: this.ringsAlphaMap,
                side: THREE.DoubleSide,
                transparent: true
            });
        }
    }

    getMaterial(parameters) {
        parameters.metalness = 0;
        parameters.roughness = 1;
        return new THREE.MeshStandardMaterial(parameters);
    }
}