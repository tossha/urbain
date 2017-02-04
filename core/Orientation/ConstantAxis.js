class OrientationConstantAxis extends OrientationAbstract
{
    constructor(angularVelocity, initialAngle, initialEpoch) {
        super();
        this.axisQuaternion = Quaternion.transfer(new Vector([0, 0, 1]), angularVelocity);
        this.angularSpeed = angularVelocity.mag;
        this.initialAngle = initialAngle || 0;
        this.initialEpoch = initialEpoch || 0;
    }

    getQuaternionByEpoch(epoch) {
        return Quaternion.mul(
            this.axisQuaternion,
            new Quaternion(
                [0, 0, 1],
                this.initialAngle + (epoch - this.initialEpoch) * this.angularSpeed
            )
        );
    }
}