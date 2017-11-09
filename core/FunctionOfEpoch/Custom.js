class FunctionOfEpochCustom extends FunctionOfEpochAbstract
{
    constructor(func) {
        super();
        this.func = func;
    }

    evaluate(epoch) {
        return this.func(epoch);
    }
}