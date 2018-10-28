
import FlightEventAbstract from "./Abstract";
import VisualFlightEventImpulsiveBurn from "../visual/FlightEvent/ImpulsiveBurn";

/**
 * Public fields:
 *      vector {Vector} - [prograde, normal, radial]
 *      prograde {Number}
 *      normal {Number}
 *      radial {Number}
 */
export default class FlightEventImpulsiveBurn extends FlightEventAbstract
{
    static VISUAL_CLASS = VisualFlightEventImpulsiveBurn;

    constructor(epoch, vector) {
        super(epoch);
        this._vector = vector || false;
        this.deltaV = vector ? vector.mag : 0;
    }

    _update(old) {
        this.deltaV = this._vector.mag;
        this._updateCallback && this._updateCallback(this, old);
    }

    set(flightEvent) {
        super.set(flightEvent);
        this._vector = flightEvent.vector;
        this.deltaV = this._vector.mag;
        return this;
    }

    set vector(vector) {
        const old = this.copy();
        this._vector = vector;
        this._update(old);
    }

    get vector() {
        return this._vector.copy();
    }

    set prograde(value) {
        const old = this.copy();
        this._vector[0] = value;
        this._update(old);
    }

    get prograde() {
        return this._vector[0];
    }

    set normal(value) {
        const old = this.copy();
        this._vector[1] = value;
        this._update(old);
    }

    get normal() {
        return this._vector[1];
    }

    set radial(value) {
        const old = this.copy();
        this._vector[2] = value;
        this._update(old);
    }

    get radial() {
        return this._vector[2];
    }
}
