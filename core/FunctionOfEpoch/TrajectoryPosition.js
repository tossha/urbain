class FunctionOfEpochTrajectoryPosition extends FunctionOfEpochAbstract
{
    constructor(trajectory, referenceFrame) {
        super();
        this.trajectory = trajectory;
        this.referenceFrame = referenceFrame;
    }

    evaluate(epoch) {
        return this.trajectory.getPositionByEpoch(epoch, this.referenceFrame);
    }
}
