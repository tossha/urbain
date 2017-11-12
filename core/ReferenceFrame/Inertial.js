class ReferenceFrameInertial extends ReferenceFrameInertialAbstract
{
    constructor(stateOfEpoch, quaternion) {
        super(stateOfEpoch);

        this.quaternion = quaternion;
    }

    getQuaternionByEpoch(epoch) {
        return Quaternion.copy(this.quaternion);
    }
}