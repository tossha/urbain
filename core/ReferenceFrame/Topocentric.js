class ReferenceFrameTopocentric extends ReferenceFrameBodyFixed
{
    constructor(origin, lat, lon, height, isInertial) {
        super(origin, isInertial);
        this.bodyFixedQuaternion = new Quaternion().setFromEuler(0, -lat, lon, 'ZYX');
        this.bodyFixedPosition = (new Vector([BODIES[this.origin].physicalModel.radius + height, 0, 0])).rotateY(-lat).rotateZ(lon);
    }

    getQuaternionByEpoch(epoch) {
        return BODIES[this.origin].orientation.getQuaternionByEpoch(epoch).mul(this.bodyFixedQuaternion)
    }

    getRotationVelocityByEpoch(epoch) {
        return Quaternion.invert(this.bodyFixedQuaternion).rotate(
            new Vector([0, 0, BODIES[this.origin].orientation.angularVel])
        );
    }

    getOriginStateByEpoch(epoch) {
        const bodyState = App.getTrajectory(this.origin).getStateByEpoch(epoch, RF_BASE);
        const bodyQuaternion = BODIES[this.origin].orientation.getQuaternionByEpoch(epoch);

        const rfVel = this.bodyFixedPosition.cross(
            new Vector([0, 0, BODIES[this.origin].orientation.angularVel])
        );

        const destPos = bodyQuaternion.rotate(this.bodyFixedPosition).add_(bodyState.position);
        const destVel = bodyQuaternion.rotate(rfVel.scale(-1)).add_(bodyState.velocity);

        return new StateVector(
            destPos,
            destVel
        );
    }
}