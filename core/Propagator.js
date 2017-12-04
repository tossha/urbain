class Propagator
{
    constructor(significantBodies, timeStep) {
        this.significantBodies = significantBodies;
        this.timeStep = timeStep;
    }

    propagateTrajectory(trajectory, /* exitCondition */ exitEpoch) {
        const lastState = trajectory.states[trajectory.states.length - 1];
        let currentPosition = lastState.state.position;
        let currentVelocity = lastState.state.velocity;
        let currentEpoch = lastState.epoch;

        while (currentEpoch < exitEpoch) {
            let acceleration = new Vector();

            for (const bodyIdIdx in this.significantBodies) {
                const body = starSystem.getObject(this.significantBodies[bodyIdIdx]);
                if (!body.physicalModel.mu) {
                    continue;
                }

                const rvec = body.trajectory.getPositionByEpoch(
                    currentEpoch,
                    trajectory.referenceFrame
                ).sub(currentPosition);

                const mag = rvec.mag;
                acceleration = rvec.mul(body.physicalModel.mu / mag / mag / mag).add(acceleration);
            }

            const newVelocity = acceleration.mul(this.timeStep).add(currentVelocity);
            const newPosition = newVelocity.add(currentVelocity).mul(this.timeStep / 2).add(currentPosition);

            currentPosition = newPosition;
            currentVelocity = newVelocity;
            currentEpoch += this.timeStep;

            trajectory.addState(currentEpoch, new StateVector(
                currentPosition,
                currentVelocity
            ));
        }
    }
}