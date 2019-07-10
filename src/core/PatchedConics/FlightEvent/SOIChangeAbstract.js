
import FlightEventAbstract from "../../FlightEvent/Abstract";

export default class FlightEventSOIChangeAbstract extends FlightEventAbstract
{
    constructor(epoch, oldSoi, newSoi) {
        super(epoch);
        this.oldSoi = oldSoi || false;
        this.newSoi = newSoi || false;
    }

    set(flightEvent) {
        super.set(flightEvent);
        this.oldSoi = flightEvent.oldSoi;
        this.newSoi = flightEvent.newSoi;
        return this;
    }
}
