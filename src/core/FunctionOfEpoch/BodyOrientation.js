import FunctionOfEpochAbstract from "./Abstract";

export default class FunctionOfEpochBodyOrientation extends FunctionOfEpochAbstract
{
    constructor(objectId) {
        super();
        this.objectId = objectId;
    }

    evaluate(epoch) {
        return sim.starSystem.getObject(this.objectId).orientation.getQuaternionByEpoch(epoch);
    }
}