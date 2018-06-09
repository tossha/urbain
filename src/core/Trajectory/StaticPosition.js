import TrajectoryAbstract from "./Abstract";
import StateVector from "../StateVector";
import {Vector} from "../../algebra";

export default class TrajectoryStaticPosition extends TrajectoryAbstract
{
    constructor(referenceFrameId, pos) {
        super();
        this.setReferenceFrame(referenceFrameId);
        this.pos = pos;
    }

    getStateInOwnFrameByEpoch(epoch) {
        return new StateVector(this.pos);
    }
}