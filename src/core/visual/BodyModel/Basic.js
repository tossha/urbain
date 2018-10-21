import * as THREE from "three";

import VisualBodyModelAbstract from "./Abstract";
import VisualModelAbstract from "../ModelAbstract"
import { sim } from "../../Simulation";

export default class VisualBodyModelBasic extends VisualBodyModelAbstract
{
    constructor(shape, config) {
        super(shape, config);

        this.texturePath = config.texturePath;
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
            && this.shape.getMaxDimension() / this.threeObj.position.length() > this.pixelAngleSize
        ) {
            this.isTextureRequested = true;
            sim.textureLoader.load(
                VisualModelAbstract.texturePath + this.texturePath,
                (txt) => {
                    if (this.threeObj) {
                        this.threeObj.material.dispose();
                        this.threeObj.material = this.getMaterial({map: txt});
                    }
                },
                undefined,
                function(err) {
                    console.log(err);
                }
            );
        }
    }
}
