import * as THREE from "three";

import VisualModelAbstract from "./ModelAbstract";
import {Quaternion, Vector} from "../algebra";
import {RF_BASE} from "../ReferenceFrame/Factory";
import { sim } from "../Simulation";

export default class VisualVector extends VisualModelAbstract
{
    constructor(vector, referenceFrameId) {
        super();
        if (referenceFrameId === undefined) {
            referenceFrameId = RF_BASE;
        }
        this.referenceFrame = window.sim.starSystem.getReferenceFrame(referenceFrameId);
        this.quaternion = Quaternion.transfer(new Vector([0,1,0]), vector);
        this.setThreeObj(new THREE.ArrowHelper(
            (new THREE.Vector3()).fromArray([1,0,0]),
            new THREE.Vector3(),
            vector.mag
        ));
    }

    render(epoch) {
        this.threeObj.quaternion.copy(this.quaternion.mul(this.referenceFrame.getQuaternionByEpoch(epoch)).toThreejs());
        this.threeObj.position.copy(sim.getVisualCoords(this.referenceFrame.getOriginPositionByEpoch(epoch)));
    }
}
