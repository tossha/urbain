export default class ExceptionOutOfRange
{
    constructor(object, epoch, minEpoch, maxEpoch) {
        this.object = object;
        this.epoch = epoch;
        this.minEpoch = minEpoch;
        this.maxEpoch = maxEpoch;
    }
}