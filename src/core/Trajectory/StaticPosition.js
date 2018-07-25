import TrajectoryAbstract from "./Abstract";
import StateVector from "../StateVector";

export default class TrajectoryStaticPosition extends TrajectoryAbstract
{
    constructor(referenceFrameId, pos) {
        super();
        this.setReferenceFrame(referenceFrameId);
        this.pos = pos;
    }

    getStateInOwnFrameByEpoch(epoch) {
        this.validateEpoch(epoch);
        return new StateVector(this.pos);
    }
}
