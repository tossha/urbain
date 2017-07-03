class VisualBodyModelBasic extends VisualBodyModelAbstract
{
    constructor(shape, color, texturePath) {
        super(shape, color);

        if (texturePath) {
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
}