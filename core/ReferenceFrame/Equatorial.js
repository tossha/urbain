class ReferenceFrameEquatorial extends ReferenceFrameAbstract
{
    constructor(origin) {
        super(origin);
    }

    getQuaternionByEpoch(epoch) {
        return BODIES[this.origin].orientation.getQuaternionByEpoch(0);
    }

    stateVectorFromBaseReferenceFrameByEpoch(epoch, state) {
        const originState = App.getTrajectory(this.origin).getStateByEpoch(epoch, RF_BASE);
        const rotation = this.getQuaternionByEpoch(epoch).invert();

        return new StateVector(
            rotation.rotate(state.position.sub_(originState.position)),
            rotation.rotate(state.velocity.sub_(originState.velocity))
        );
    }

    stateVectorToBaseReferenceFrameByEpoch(epoch, state) {
        const originState = App.getTrajectory(this.origin).getStateByEpoch(epoch, RF_BASE);
        const rotation = this.getQuaternionByEpoch(epoch);

        return new StateVector(
            rotation.rotate(state.position).add_(originState.position),
            rotation.rotate(state.velocity).add_(originState.velocity)
        );
    }
}