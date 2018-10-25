
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
            )).onUpdate(
                event => this.propagate(event.epoch)
            ));
        });
    }

    propagate(startEpoch) {
        this.propagator.propagate(this, startEpoch);
    }
}
