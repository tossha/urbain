class Orientation
{
    constructor(epoch, axisOrientation, angularVel) {
        this.epoch = epoch;
        this.axisOrientation = axisOrientation;
        this.angularVel = angularVel;
    }

    getOrientationByEpoch(epoch) {
        return (new THREE.Quaternion())
            .copy(this.axisOrientation)
            .multiply(getQuaternionByEuler(
                0,
                0,
                (epoch - this.epoch) * this.angularVel
            ));
    }
}