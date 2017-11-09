class ReferenceFrameInertialDynamic extends ReferenceFrameInertialAbstract
{
    constructor(stateOfEpoch, quaternionOfEpoch) {
        super(stateOfEpoch);

        this.quaternionOfEpoch = quaternionOfEpoch;
    }

    getQuaternionByEpoch(epoch) {
        return this.quaternionOfEpoch.evaluate(epoch);
    }
}