class ReferenceFrameEcliptic extends ReferenceFrameAbstract
{
    constructor(origin) {
        super(origin);
    }

    stateVectorFromBaseReferenceFrameByEpoch(epoch, state) {
        const originState = TRAJECTORIES[this.origin].getStateByEpoch(epoch, RF_BASE);

        const destinationPos = state.position.sub(originState.position);
        const destinationVel = state.velocity.sub(originState.velocity);

        return new StateVector(
            destinationPos.x,
            destinationPos.y,
            destinationPos.z,
            destinationVel.x,
            destinationVel.y,
            destinationVel.z
        );
    }

    stateVectorToBaseReferenceFrameByEpoch(epoch, state) {
        const originState = TRAJECTORIES[this.origin].getStateByEpoch(epoch, RF_BASE);

        const destinationPos = state.position.add(originState.position);
        const destinationVel = state.velocity.add(originState.velocity);

        return new StateVector(
            destinationPos.x,
            destinationPos.y,
            destinationPos.z,
            destinationVel.x,
            destinationVel.y,
            destinationVel.z
        );
    }
}