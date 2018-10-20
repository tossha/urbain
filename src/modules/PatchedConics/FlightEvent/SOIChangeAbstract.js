
import FlightEventAbstract from "../../../core/FlightEvent/Abstract";

export default class FlightEventSOIChangeAbstract extends FlightEventAbstract
{
    constructor(epoch, oldSoi, newSoi) {
        super(epoch);
        this.oldSoi = oldSoi;
        this.newSoi = newSoi;
    }

    copy(flightEvent) {
        super.copy(flightEvent);
        this.oldSoi = flightEvent.oldSoi;
        this.newSoi = flightEvent.newSoi;
    }
}
