class Orientation
{
    constructor(epoch, axisOrientation, angularVel) {
        this.epoch = epoch;
        this.axisOrientation = Quaternion.copy(axisOrientation);
        this.angularVel = angularVel;
    }

    getOrientationByEpoch(epoch) {
        return Quaternion.mul(
            this.axisOrientation,
            (new Quaternion()).setAxisAngle(
                [0, 0, 1],
                (epoch - this.epoch) * this.angularVel
            )
        );
    }
}