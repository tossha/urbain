
export default class FlightEventAbstract
{
    static VISUAL_CLASS = null;

    constructor(epoch) {
        this._epoch = epoch;
    }

    copy(flightEvent) {
        this._epoch = flightEvent._epoch;
    }

    set epoch(epoch) {
        this._epoch = epoch;
    }

    get epoch() {
        return this._epoch;
    }

    getVisualClass() {
        return this.constructor.VISUAL_CLASS;
    }
}
