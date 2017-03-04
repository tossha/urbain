class ReferenceFrameEcliptic extends ReferenceFrameAbstract
{
    constructor(origin) {
        super(origin);
    }

    stateVectorFromBaseReferenceFrameByEpoch(epoch, state) {
        const originState = App.getTrajectory(this.origin).getStateByEpoch(epoch, RF_BASE);

        return new StateVector(
            state.position.sub(originState.position),
            state.velocity.sub(originState.velocity)
        );
    }

    stateVectorToBaseReferenceFrameByEpoch(epoch, state) {
        const originState = App.getTrajectory(this.origin).getStateByEpoch(epoch, RF_BASE);

        return new StateVector(
            state.position.add(originState.position),
            state.velocity.add(originState.velocity)
        );
    }
}