import VisualBodyModelAbstract from "./Abstract";
import VisualModelAbstract from "../ModelAbstract"

export default class VisualBodyModelBasic extends VisualBodyModelAbstract
{
    constructor(shape, color, texturePath) {
        super(shape, color);

        this.texturePath = texturePath;
        this.isTextureRequested = false;
    }

    getMaterial(parameters) {
        parameters.metalness = 0;
        parameters.roughness = 1;
        return new THREE.MeshStandardMaterial(parameters);
    }

    render(epoch) {
        super.render(epoch);
        if (!this.isTextureRequested
            && this.texturePath
            && this.shape.getMaxDimension() / this.threeObj.position.length() > sim.raycaster.getPixelAngleSize()
        ) {
            this.isTextureRequested = true;
            sim.textureLoader.load(
                VisualModelAbstract.texturePath + this.texturePath,
                (txt) => {
                    this.threeObj.material.dispose();
                    this.threeObj.material = this.getMaterial({map: txt});
                },
                undefined,
                function(err) {
                    console.log(err);
                }
            );
        }
    }
}