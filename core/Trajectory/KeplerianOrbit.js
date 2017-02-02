class TrajectoryKeplerianOrbit extends TrajectoryAbstract
{
    constructor(referenceFrame, keplerianObject, color) {
        super(referenceFrame);

        this.keplerianObject = keplerianObject;

        if (color) {
            this.visualModel = new VisualTrajectoryModelKeplerianOrbit(this, color);
        }
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

    get e() {
        return this.keplerianObject.e;
    }

    set e(value) {
        this.keplerianObject.e = value;
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

    /**
     *  @see http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf
     */
    getStateInOwnFrameByEpoch(epoch) {
        return this.keplerianObject.getStateByEpoch(epoch);
    }

    static createFromState(referenceFrame, state, mu, epoch, color) {
        return new TrajectoryKeplerianOrbit(
            referenceFrame,
            KeplerianObject.createFromState(state, mu, epoch),
            color
        );
    }
}
