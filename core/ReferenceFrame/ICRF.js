class ReferenceFrameICRF extends ReferenceFrameInertialAbstract
{
    constructor(origin) {
        super(origin);
        this.quaternion = new Quaternion([-1, 0, 0], deg2rad(23.4)); // needs refining
    }

    getQuaternionByEpoch(epoch) {
        return this.quaternion;
    }
}