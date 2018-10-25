
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
        this._vector = vector;
        this.deltaV = vector.mag;
    }

    _update() {
        this.deltaV = this._vector.mag;
        this._updateCallback && this._updateCallback(this);
    }

    set vector(vector) {
        this._vector = vector;
        this._update();
    }

    get vector() {
        return this._vector.copy();
    }

    set prograde(value) {
        this._vector[0] = value;
        this._update();
    }

    get prograde() {
        return this._vector[0];
    }

    set normal(value) {
        this._vector[1] = value;
        this._update();
    }

    get normal() {
        return this._vector[1];
    }

    set radial(value) {
        this._vector[2] = value;
        this._update();
    }

    get radial() {
        return this._vector[2];
    }
}
