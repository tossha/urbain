class TrajectoryStaticPosition extends TrajectoryAbstract
{
    constructor(starSystem, referenceFrameId, pos) {
        super(starSystem, referenceFrameId);

        this.pos = pos;
    }

    getStateInOwnFrameByEpoch(epoch) {
        return new StateVector(this.pos);
    }
}