class ReferenceFrameBodyFixed extends ReferenceFrameAbstract
{
    constructor(origin, isInertial) {
        super();
        this.origin = origin;
        this.isInertial = isInertial;
        this.body = starSystem.getObject(this.origin);
    }

    getQuaternionByEpoch(epoch) {
        return this.body.orientation.getQuaternionByEpoch(epoch);
    }

    getOriginStateByEpoch(epoch) {
        return starSystem.getTrajectory(this.origin).getStateByEpoch(epoch, RF_BASE);
    }

    getOriginPositionByEpoch(epoch) {
        return this.getOriginStateByEpoch(epoch).position;
    }

    getRotationVelocityByEpoch(epoch) {
        return new Vector([0, 0, this.body.orientation.angularVel]);
    }

    stateVectorFromBaseReferenceFrameByEpoch(epoch, state) {
        const originState = this.getOriginStateByEpoch(epoch);
        const rotation = this.getQuaternionByEpoch(epoch).invert();

        const destPos = rotation.rotate(state.position.sub_(originState.position));
        let destVel = rotation.rotate(state.velocity.sub_(originState.velocity));

        if (!this.isInertial) {
            const rfVel = destPos.cross(this.getRotationVelocityByEpoch(epoch));
            destVel.add_(rfVel);
        }

        return new StateVector(
            destPos,
            destVel
        );
    }

    stateVectorToBaseReferenceFrameByEpoch(epoch, state) {
        const originState = this.getOriginStateByEpoch(epoch);
        const rotation = this.getQuaternionByEpoch(epoch);

        const destPos = rotation.rotate(state.position).add_(originState.position);
        let destVel;

        if (!this.isInertial) {
            const rfVel = state.position.cross(this.getRotationVelocityByEpoch(epoch));
            destVel = rotation.rotate(state.velocity.sub_(rfVel)).add_(originState.velocity);
        } else {
            destVel = rotation.rotate(state.velocity).add_(originState.velocity);
        }

        return new StateVector(
            destPos,
            destVel
        );
    }
}