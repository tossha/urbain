class VisualBodyModelRings extends VisualBodyModelAbstract
{
    constructor(shape, color, texturePath, ringsColorMapPath, ringsAlphaMapPath) {
        super(shape, color);
        this.texturePath = texturePath;
        this.ringsColorMapPath = ringsColorMapPath;
        this.ringsAlphaMapPath = ringsAlphaMapPath;
    }

    onLoadFinish() {
        super.onLoadFinish();
        let that = this;

        if (this.texturePath) {
            sim.textureLoader.load(
                VisualModelAbstract.texturePath + this.texturePath,
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

        if (this.ringsColorMapPath) {
            sim.textureLoader.load(
                VisualModelAbstract.texturePath + this.ringsColorMapPath,
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

        if (this.ringsAlphaMapPath) {
            sim.textureLoader.load(
                VisualModelAbstract.texturePath + this.ringsAlphaMapPath,
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
            new THREE.CircleGeometry(140220, 64),
            this.getMaterial({color: this.color, wireframe: true})
        );

        container.add(this.bodyThreeObj);
        container.add(this.ringsThreeObj);

        return container;
    }

    updateRingsMaterial() {
        if (this.ringsColorMap && this.ringsAlphaMap) {
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