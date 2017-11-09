class ReferenceFrameInertial extends ReferenceFrameInertialAbstract
{
    constructor(stateOfEpoch, quaternion) {
        super(stateOfEpoch);

        this.quaternion = quaternion;
    }

    getQuaternionByEpoch(epoch) {
        return this.quaternion;
    }
}