class FunctionOfEpochObjectPosition extends FunctionOfEpochAbstract
{
    constructor(objectId, referenceFrame) {
        super();
        this.objectId = objectId;
        this.referenceFrame = referenceFrame;
    }

    evaluate(epoch) {
        return TRAJECTORIES[this.objectId].getPositionByEpoch(epoch, this.referenceFrame);
    }
}