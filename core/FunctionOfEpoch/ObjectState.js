class FunctionOfEpochObjectState extends FunctionOfEpochAbstract
{
    constructor(objectId, referenceFrame) {
        super();
        this.objectId = objectId;
        this.referenceFrame = referenceFrame;
    }

    evaluate(epoch) {
        return sim.starSystem.getTrajectory(this.objectId).getStateByEpoch(epoch, this.referenceFrame);
    }
}