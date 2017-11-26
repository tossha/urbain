class TrajectoryStaticPosition extends TrajectoryAbstract
{
    constructor(referenceFrameId, pos) {
        super(referenceFrameId);

        this.pos = pos;
    }

    getStateInOwnFrameByEpoch(epoch) {
        return new StateVector(this.pos);
    }
}