import * as THREE from "three";

import VisualModelAbstract from "./ModelAbstract";
import { sim } from "../Simulation";

export default class VisualSprite extends VisualModelAbstract {
    constructor(positionOfEpoch, texture, verticalAlign, horizontalAlign, scale) {
        super();

        this.positionOfEpoch = positionOfEpoch;

        new THREE.TextureLoader().load(texture, texture => {
            scale = scale || 1;
            this.setThreeObj(new THREE.Sprite(new THREE.SpriteMaterial(
                {map: texture, sizeAttenuation: false, color: 0x0099AA}
            )));
            this.threeObj.scale.set(
                texture.image.width / 800 * scale, // god knows why 800, but it works...
                texture.image.height / 800 * scale,
                1
            );
            this.threeObj.center.set(
                horizontalAlign === 'right'
                    ? 0
                    : horizontalAlign === 'left'
                        ? 1
                        : 0.5,
                verticalAlign === 'top'
                    ? 0
                    : verticalAlign === 'bottom'
                        ? 1
                        : 0.5
            );
        });
    }

    render(epoch) {
        this.threeObj.position.copy(sim.getVisualCoords(this.positionOfEpoch.evaluate(epoch)));
    }
}
