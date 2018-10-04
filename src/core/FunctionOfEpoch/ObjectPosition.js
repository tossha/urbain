import FunctionOfEpochAbstract from "./Abstract";
import { sim } from "../Simulation";

export default class FunctionOfEpochObjectPosition extends FunctionOfEpochAbstract
{
    constructor(objectId, referenceFrame) {
        super();
        this.objectId = objectId;
        this.referenceFrame = referenceFrame;
    }

    evaluate(epoch) {
        return sim.starSystem.getTrajectory(this.objectId).getPositionByEpoch(epoch, this.referenceFrame);
    }
}
