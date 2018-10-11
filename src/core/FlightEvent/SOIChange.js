
import FlightEventAbstract from "./Abstract";

export default class FlightEventSOIChange extends FlightEventAbstract
{
    constructor(epoch, oldSoi, newSoi) {
        super(epoch);
        this.oldSoi = oldSoi;
        this.newSoi = newSoi;
    }
}
