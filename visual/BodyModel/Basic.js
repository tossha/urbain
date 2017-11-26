class VisualBodyModelBasic extends VisualBodyModelAbstract
{
    constructor(shape, color, texturePath) {
        super(shape, color);

        this.texturePath = texturePath;
    }

    onLoadFinish() {
        super.onLoadFinish();
        if (this.texturePath) {
            let that = this;

            sim.textureLoader.load(
                VisualModelAbstract.texturePath + this.texturePath,
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
}