
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
                this.sortManeuvers();
                this.propagate(Math.min(oldEvent.epoch, newEvent.epoch));
            }));
            this.updateHandlers.map(h => h(this));
        });
    }

    sortManeuvers() {
        this.flightEvents.sort((e1, e2) => (e1.epoch < e2.epoch) ? -1 : (e1.epoch > e2.epoch ? 1 : 0));
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
