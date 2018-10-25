import ReferenceFrameInertialAbstract from "./InertialAbstract";

export default class ReferenceFrameInertialDynamic extends ReferenceFrameInertialAbstract
{
    constructor(stateOfEpoch, quaternionOfEpoch) {
        super(stateOfEpoch);

        this.quaternionOfEpoch = quaternionOfEpoch;
    }

    /**
     * @param epoch
     * @return {Quaternion}
     */
    getQuaternionByEpoch(epoch) {
        return this.quaternionOfEpoch.evaluate(epoch);
    }
}