
class PhysicalBodyModel
{
    constructor(mu, radius) {
        this.mu     = mu;     // gravitational parameter
        this.radius = radius;
    }
}

class TrajectoryCalculator
{
    constructor(referenceFrame, baseEpoch, baseState, timeStep) {
        this.trajectory = new TrajectoryStateArray(referenceFrame);
        this.trajectory.addState(baseEpoch, baseState);
        this.timeStep = timeStep;
    }
    
    calculateTo(newEpoch) {
        const states = this.trajectory.states;
        for (let currentEpoch = lastPoint.time; currentEpoch < newEpoch; currentEpoch += this.timeStep) {
            const lastPoint = states[states.length - 1];
            
            let acceleration = ZERO_VECTOR;
            for (bodyId in BODIES) {
                const body = BODIES[bodyId];
                if (body.physicalModel.mu == 0) {
                    continue;
                }
                const vec12 = body.trajectory.getPositionByEpoch(currentEpoch,
                        this.trajectory.referenceFrame).sub(lastPoint.position);
                const abs = vec12.abs();
                acceleration = vec12.mul(body.physicalModel.mu / abs / abs / abs).add(acceleration);
            }
            
            const newVelocity = acceleration.mul(this.timeStep).add(lastPoint.velocity);
            const newPosition = newVelocity.add(lastPoint.velocity).mul(this.timeStep / 2).add(lastPoint.position);
            
            states.push({
                "time": currentEpoch + this.timeStep,
                "state": new StateVector(
                        newPosition.x, newPosition.y, newPosition.z,
                        newVelocity.x, newVelocity.y, newVelocity.z)
            });
        }
    }
}
