export default class ExceptionOutOfRange
{
    constructor(object, trajectory, epoch, minEpoch, maxEpoch) {
        this.object = object;
        this.trajectory = trajectory;
        this.epoch = epoch;
        this.minEpoch = minEpoch;
        this.maxEpoch = maxEpoch;
    }
}