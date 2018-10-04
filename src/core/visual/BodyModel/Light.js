import * as THREE from "three";

import VisualBodyModelBasic from "./Basic";
import { sim } from "../../Simulation";

export default class VisualBodyModelLight extends VisualBodyModelBasic
{
    constructor(shape, config) {
        super(shape, config);
        this.light = new THREE.PointLight(
            config.lightColor,
            config.lightIntensity,
            config.lightDistance || null,
            config.lightDecay || null
        );
        this.scene.add(this.light);
    }

    render(epoch) {
        super.render(epoch);
        this.light.position.copy(sim.getVisualCoords(this.body.getPositionByEpoch(epoch)));
    }

    getMaterial(parameters) {
        return new THREE.MeshBasicMaterial(parameters);
    }
}
