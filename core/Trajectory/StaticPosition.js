class TrajectoryStaticPosition extends TrajectoryAbstract
{
    constructor(referenceFrame, pos) {
        super(referenceFrame);

        this.pos = pos;
    }

    getStateInOwnFrameByEpoch(epoch) {
        return new StateVector(this.pos.x, this.pos.y, this.pos.z, 0, 0, 0);
    }
}