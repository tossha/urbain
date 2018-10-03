import FunctionOfEpochAbstract from "./Abstract";

export default class Constant extends FunctionOfEpochAbstract
{
    constructor(value) {
        super();
        this.value = value;
    }

    evaluate(epoch) {
        return this.value;
    }
}