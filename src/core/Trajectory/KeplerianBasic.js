import TrajectoryKeplerianAbstract from "./KeplerianAbstract";

export default class TrajectoryKeplerianBasic extends TrajectoryKeplerianAbstract
{
    constructor(referenceFrameId, keplerianObject) {
        super(referenceFrameId);
        this.keplerianObject = keplerianObject;
    }

    dump() {
        return {
            referenceFrame: this.referenceFrame.id,
            keplerianObject: this.keplerianObject.dump(),
            visualModel: this.visualModel.config,
            minEpoch: this.minEpoch,
            maxEpoch: this.maxEpoch,
        };
    }

    onUpdate(callback) {
        this.keplerianObject.setUpdateCallback(() => callback(this));
        return this;
    }

    get mu() {
        return this.keplerianObject.mu;
    }

    set mu(value) {
        this.keplerianObject.mu = value;
    }

    get sma() {
        return this.keplerianObject.sma;
    }

    set sma(value) {
        this.keplerianObject.sma = value;
    }

    get ecc() {
        return this.keplerianObject.ecc;
    }

    set ecc(value) {
        this.keplerianObject.ecc = value;
    }

    get inc() {
        return this.keplerianObject.inc;
    }

    set inc(value) {
        this.keplerianObject.inc = value;
    }

    get raan() {
        return this.keplerianObject.raan;
    }

    set raan(value) {
        this.keplerianObject.raan = value;
    }

    get aop() {
        return this.keplerianObject.aop;
    }

    set aop(value) {
        this.keplerianObject.aop = value;
    }

    get ta() {
        return this.keplerianObject.ta;
    }

    set ta(value) {
        this.keplerianObject.ta = value;
    }

    get epoch() {
        return this.keplerianObject.epoch;
    }

    set epoch(value) {
        this.keplerianObject.epoch = value;
    }

    get period() {
        return this.keplerianObject.period;
    }

    getKeplerianObjectByEpoch(epoch, referenceFrameOrId) {
        this.validateEpoch(epoch);
        return this._transformKeplerianObject(this.keplerianObject, referenceFrameOrId);
    }
}
