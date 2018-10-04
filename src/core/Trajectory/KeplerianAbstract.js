import TrajectoryAbstract from "./Abstract";

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
