import * as THREE from "three";
import VisualModelAbstract from "./ModelAbstract";

export default class VisualPoint extends VisualModelAbstract
{
    constructor(positionOfEpoch, color, size) {
        super();
        this.positionOfEpoch = positionOfEpoch;
        this.color = color;
        this.size = size;
        this.setThreeObj(new THREE.Mesh(
            new THREE.SphereGeometry(1, 8, 8),
            new THREE.MeshBasicMaterial({color: this.color})
        ));
    }

    render(epoch) {
        this.setPosition(this.positionOfEpoch.evaluate(epoch));

        const scaleKoeff = this.size * this.threeObj.position.length() * this.pixelAngleSize;
        this.threeObj.scale.x = scaleKoeff;
        this.threeObj.scale.y = scaleKoeff;
        this.threeObj.scale.z = scaleKoeff;
    }
}