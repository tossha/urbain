class ReferenceFrameRotating extends ReferenceFrameAbstract
{
    constructor(origin) {
        super(origin);
    }

    getQuaternionByEpoch(epoch) {
        return BODIES[this.origin].orientation.getOrientationByEpoch(epoch);
    }

    getRotationVelocityByEpoch(epoch) {
        return new Vector([0, 0, BODIES[this.origin].orientation.angularVel]);
    }

    stateVectorFromBaseReferenceFrameByEpoch(epoch, state) {
        const originState = TRAJECTORIES[this.origin].getStateByEpoch(epoch, RF_BASE);
        const rotation = this.getQuaternionByEpoch(epoch).invert();

        const destPos = rotation.rotate(state.position.sub_(originState.position));

        const rfVel = destPos.cross(this.getRotationVelocityByEpoch(epoch));
        const destVel = rotation.rotate(state.velocity.sub_(originState.velocity)).add_(rfVel);

        return new StateVector(
            destPos,
            destVel
        );
    }

    stateVectorToBaseReferenceFrameByEpoch(epoch, state) {
        const originState = TRAJECTORIES[this.origin].getStateByEpoch(epoch, RF_BASE);
        const rotation = this.getQuaternionByEpoch(epoch);

        const rfVel = state.position.cross(this.getRotationVelocityByEpoch(epoch));

        const destPos = rotation.rotate(state.position).add_(originState.position);
        const destVel = rotation.rotate(state.velocity.sub_(rfVel)).add_(originState.velocity);

        return new StateVector(
            destPos,
            destVel
        );
    }
}