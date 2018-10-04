import * as THREE from "three";
import VisualModelAbstract from "./ModelAbstract";
import { sim } from "../Simulation";

export default class VisualPoint extends VisualModelAbstract
{
    constructor(position, color, size) {
        super();
        this.position = position;
        this.color = color;
        this.size = size;
        this.setThreeObj(new THREE.Mesh(
            new THREE.SphereGeometry(1, 8, 8),
            new THREE.MeshBasicMaterial({color: this.color})
        ));
    }

    render(epoch) {
        this.threeObj.position.copy(sim.getVisualCoords(this.position.evaluate(epoch)));

        const scaleKoeff = this.size * this.threeObj.position.length() * sim.raycaster.getPixelAngleSize();
        this.threeObj.scale.x = scaleKoeff;
        this.threeObj.scale.y = scaleKoeff;
        this.threeObj.scale.z = scaleKoeff;
    }
}