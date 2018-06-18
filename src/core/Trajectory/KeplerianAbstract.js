import Events from "./../Events";
import TrajectoryAbstract from "./Abstract";
import KeplerianEditor from "../KeplerianEditor";

export default class TrajectoryKeplerianAbstract extends TrajectoryAbstract
{
    constructor(referenceFrameId) {
        super();
        this.setReferenceFrame(referenceFrameId);
    }

    getStateInOwnFrameByEpoch(epoch) {
        return this.getKeplerianObjectByEpoch(epoch).getStateByEpoch(epoch);
    }
}