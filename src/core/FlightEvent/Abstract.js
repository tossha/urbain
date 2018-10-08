
export default class FlightEventAbstract
{
    constructor(epoch) {
        this._epoch = epoch;
    }

    set epoch(epoch) {
        this._epoch = epoch;
    }

    get epoch() {
        return this._epoch;
    }
}
