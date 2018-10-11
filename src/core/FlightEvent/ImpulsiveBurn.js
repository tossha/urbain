
import FlightEventAbstract from "./Abstract";

export default class FlightEventImpulsiveBurn extends FlightEventAbstract
{
    constructor(epoch, vector) {
        super(epoch);
        this.vector = vector;
        this.deltaV = vector.mag;
    }
}
