
export default class FlightEventAbstract
{
    static VISUAL_CLASS = null;

    constructor(epoch) {
        this._epoch = epoch || false;
        this._updateCallback = false;
    }

    onUpdate(callback) {
        this._updateCallback = callback;
        return this;
    }

    set(flightEvent) {
        this._epoch = flightEvent._epoch;
        return this;
    }

    copy() {
        return (new this.constructor()).set(this);
    }

    set epoch(epoch) {
        const old = this.copy();
        this._epoch = epoch;
        this._updateCallback && this._updateCallback(this, old);
    }

    get epoch() {
        return this._epoch;
    }

    getVisualClass() {
        return this.constructor.VISUAL_CLASS;
    }
}
