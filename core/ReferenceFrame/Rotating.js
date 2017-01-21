class ReferenceFrameRotating extends ReferenceFrameAbstract
{
    constructor(origin) {
        super(origin);
    }

    getQuaternionByEpoch(epoch) {
        return BODIES[this.origin].orientation.getOrientationByEpoch(epoch);
    }

    getRotationVelocityByEpoch(epoch) {
        return new Vector3(0, 0, BODIES[this.origin].orientation.angularVel);
    }

    stateVectorFromBaseReferenceFrameByEpoch(epoch, state) {
        const rotation = new THREE.Quaternion().copy(this.getQuaternionByEpoch(epoch)).inverse();

        const originState = TRAJECTORIES[this.origin].getStateByEpoch(epoch, RF_BASE);

        const statePosThreeVec = vectorToThreeVector(state.position.sub(originState.position));
        const stateVelThreeVec = vectorToThreeVector(state.velocity.sub(originState.velocity));

        const statePosRotated = threeVectorToVector(statePosThreeVec.applyQuaternion(rotation));
        const stateVelRotated = threeVectorToVector(stateVelThreeVec.applyQuaternion(rotation));

        const destPos = statePosRotated;
        const rfVel = threeVectorToVector(
            new THREE.Vector3().crossVectors(
                vectorToThreeVector(destPos),
                vectorToThreeVector(this.getRotationVelocityByEpoch(epoch))
            )
        );
        const destVel = stateVelRotated.add(rfVel);

        return new StateVector(
            destPos.x,
            destPos.y,
            destPos.z,
            destVel.x,
            destVel.y,
            destVel.z
        );
    }

    stateVectorToBaseReferenceFrameByEpoch(epoch, state) {
        const originState = TRAJECTORIES[this.origin].getStateByEpoch(epoch, RF_BASE);

        const statePosThreeVec = vectorToThreeVector(state.position);

        const rfVel = threeVectorToVector(
            new THREE.Vector3().crossVectors(
                statePosThreeVec,
                vectorToThreeVector(this.getRotationVelocityByEpoch(epoch))
            )
        );

        const stateVelThreeVec = vectorToThreeVector(state.velocity.sub(rfVel));

        const rotation = this.getQuaternionByEpoch(epoch);
        const statePosRotated = threeVectorToVector(statePosThreeVec.applyQuaternion(rotation));
        const stateVelRotated = threeVectorToVector(stateVelThreeVec.applyQuaternion(rotation));

        const destPos = statePosRotated.add(originState.position);
        const destVel = stateVelRotated.add(originState.velocity);

        return new StateVector(
            destPos.x,
            destPos.y,
            destPos.z,
            destVel.x,
            destVel.y,
            destVel.z
        );
    }
}