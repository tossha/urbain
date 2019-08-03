import * as THREE from "three";

import VisualModelAbstract from "./ModelAbstract";
import { sim } from "../simulation-engine";

export default class VisualReferenceFrame extends VisualModelAbstract
{
    constructor(referenceFrame) {
        super(sim);
        this.referenceFrame = referenceFrame;
        this.setThreeObj(new THREE.AxesHelper(1));
    }

    render(epoch) {
        const position = sim.getVisualCoords(this.referenceFrame.getOriginPositionByEpoch(epoch));
        const scale = position.length() / 10;
        this.threeObj.position.copy(position);
        this.threeObj.quaternion.copy(
            this.referenceFrame.getQuaternionByEpoch(epoch).toThreejs()
        );
        this.threeObj.scale.set(scale, scale, scale);
    }
}
