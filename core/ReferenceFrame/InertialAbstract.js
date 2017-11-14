class ReferenceFrameInertialAbstract extends ReferenceFrameAbstract
{
    constructor(stateOfEpoch) {
        super();
        this.stateOfEpoch = stateOfEpoch;
    }

    getOriginPositionByEpoch(epoch) {
        return this.stateOfEpoch.evaluate(epoch).position;
    }

    getOriginStateByEpoch(epoch) {
        return this.stateOfEpoch.evaluate(epoch);
    }

    stateVectorFromBaseReferenceFrameByEpoch(epoch, state) {
        const originState = this.stateOfEpoch.evaluate(epoch);
        const rotation = this.getQuaternionByEpoch(epoch).invert();

        return new StateVector(
            rotation.rotate(state.position.sub_(originState.position)),
            rotation.rotate(state.velocity.sub_(originState.velocity))
        );
    }

    stateVectorToBaseReferenceFrameByEpoch(epoch, state) {
        const originState = this.stateOfEpoch.evaluate(epoch);
        const rotation = this.getQuaternionByEpoch(epoch);

        return new StateVector(
            rotation.rotate(state.position).add_(originState.position),
            rotation.rotate(state.velocity).add_(originState.velocity)
        );
    }
}