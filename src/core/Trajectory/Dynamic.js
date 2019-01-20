
import TrajectoryComposite from "./Composite";
import FlightEventImpulsiveBurn from "../FlightEvent/ImpulsiveBurn";
import {Vector} from "../algebra";

export default class TrajectoryDynamic extends TrajectoryComposite
{
    /**
     *
     * @param propagator {PropagatorAbstract}
     */
    constructor(propagator) {
        super();
        this.propagator = propagator;
        this.updateHandlers = [];
    }

    dump() {
        let dumpObj = {
            components: [],
            events: [],
            visualModel: this.visualModel.config,
            minEpoch: this.minEpoch,
            maxEpoch: this.maxEpoch,
        };
        for (let component of this.components) {
            dumpObj.components.push(component.dump());
        }
        for (let flightEvent of this.flightEvents) {
            if (flightEvent instanceof FlightEventImpulsiveBurn) {
                dumpObj.events.push({
                    epoch: flightEvent._epoch,
                    x: flightEvent._vector[0],
                    y: flightEvent._vector[1],
                    z: flightEvent._vector[2],
                });
            }
        }
        return dumpObj;
    }

    /**
     *
     * @param trajectory {TrajectoryAbstract}
     */
    addComponent(trajectory) {
        if (this.components.length === 0) {
            trajectory.isEditable = true;
            trajectory.onUpdate(traj => this.propagate(traj.epoch));
        }

        super.addComponent(trajectory);

        trajectory.onClick((pointEpoch) => {
            this.addFlightEvent((new FlightEventImpulsiveBurn(
                pointEpoch,
                new Vector([0, 0, 0])
            )).onUpdate((newEvent, oldEvent) => {
                this.sortFlightEvents();
                this.propagate(Math.min(oldEvent.epoch, newEvent.epoch));
            }));
            this.updateHandlers.map(h => h(this));
        });
    }

    removeFlightEvent(flightEvent) {
        super.removeFlightEvent(flightEvent);
        if (flightEvent instanceof FlightEventImpulsiveBurn) {
            this.propagator.propagate(this, flightEvent.epoch);
        }
    }

    propagate(startEpoch) {
        this.propagator.propagate(this, startEpoch);
        this.updateHandlers.map(h => h(this));
    }

    onUpdate(handler) {
        this.updateHandlers.push(handler);
    }

    removeListener(handler) {
        for (let i in this.updateHandlers) {
            if (this.updateHandlers[i] === handler) {
                this.updateHandlers = this.updateHandlers.splice(i, 1);
                break;
            }
        }
    }
}
