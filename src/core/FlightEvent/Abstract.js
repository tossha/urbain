
export default class FlightEventAbstract
{
    static VISUAL_CLASS = null;

    constructor(epoch) {
        this._epoch = epoch;
        this._updateCallback = false;
    }

    onUpdate(callback) {
        this._updateCallback = callback;
        return this;
    }

    copy(flightEvent) {
        this._epoch = flightEvent._epoch;
    }

    set epoch(epoch) {
        this._epoch = epoch;
        this._updateCallback && this._updateCallback(this);
    }

    get epoch() {
        return this._epoch;
    }

    getVisualClass() {
        return this.constructor.VISUAL_CLASS;
    }
}
