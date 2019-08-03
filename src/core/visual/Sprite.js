import * as THREE from "three";

import VisualModelAbstract from "./ModelAbstract";
import { sim } from '../simulation-engine';

export default class VisualSprite extends VisualModelAbstract
{
    constructor(positionOfEpoch, texturePath, color, verticalAlign, horizontalAlign, scale) {
        super(sim);
        this.positionOfEpoch = positionOfEpoch;
        this.verticalAlign = verticalAlign || 'center';
        this.horizontalAlign = horizontalAlign || 'center';
        this.scale = scale || 1;
        this.color = color || 0xFFFFFF;
        this.loadTexture(texturePath);
    }

    loadTexture(texturePath) {
        texturePath && sim.textureLoader.load(texturePath, texture => {
            this.setTexture(texture);
        });
    }

    setTexture(textureObj) {
        if (this._dropped)
            return;

        this.setThreeObj(new THREE.Sprite(new THREE.SpriteMaterial(
            {map: textureObj, sizeAttenuation: false, color: this.color}
        )));
        this.setScale(this.scale);
        this.updateCenter();
    }

    updateCenter() {
        this.threeObj && this.threeObj.center.set(
            this.horizontalAlign === 'right'
                ? 0
                : this.horizontalAlign === 'left'
                ? 1
                : 0.5,
            this.verticalAlign === 'top'
                ? 0
                : this.verticalAlign === 'bottom'
                ? 1
                : 0.5
        );
    }

    setScale(scale) {
        this.scale = scale;
        this.threeObj.scale.set(
            this.threeObj.material.map.image.width / 800 * this.scale, // god knows why 800, but it works...
            this.threeObj.material.map.image.height / 800 * this.scale,
            1
        );
    }

    setColor(color) {
        this.color = color;
        this.threeObj.material.color.set(this.color);
        this.threeObj.material.needsUpdate = true;
    }

    setAlign(vertical, horizontal) {
        this.verticalAlign = vertical;
        this.horizontalAlign = horizontal;
        this.updateCenter();
    }

    setPositionOfEpoch(positionOfEpoch) {
        this.positionOfEpoch = positionOfEpoch;
    }

    render(epoch) {
        this.positionOfEpoch && this.setPosition(this.positionOfEpoch.evaluate(epoch));
    }

    drop() {
        super.drop();
        this._dropped = true;
    }
}
