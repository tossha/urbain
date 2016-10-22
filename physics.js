
class PhysicalBodyModel
{
    constructor(mu, radius) {
        this.mu     = mu;     // gravitational parameter
        this.radius = radius;
    }
}

class Propagator
{
    constructor(significantBodies, timeStep) {
        this.significantBodies = significantBodies;
        this.timeStep = timeStep;
    }
    
    propagateTrajectory(trajectory, /* exitCondition */ exitEpoch) {
        const states = trajectory.states;
        for (let currentEpoch = states[states.length - 1].epoch; currentEpoch < exitEpoch; currentEpoch += this.timeStep) {
            const lastPoint = states[states.length - 1];
            
            let acceleration = ZERO_VECTOR;
            for (let bodyIdIdx in this.significantBodies) {
                const body = BODIES[this.significantBodies[bodyIdIdx]];
                if (!body.physicalModel.mu) {
                    continue;
                }
                const rvec = body.trajectory.getPositionByEpoch(
                    currentEpoch,
                    trajectory.referenceFrame
                ).sub(lastPoint.state.position);
                
                const mag = rvec.mag();
                acceleration = rvec.mul(body.physicalModel.mu / mag / mag / mag).add(acceleration);
            }
            
            const newVelocity = acceleration.mul(this.timeStep).add(lastPoint.state.velocity);
            const newPosition = newVelocity.add(lastPoint.state.velocity).mul(this.timeStep / 2).add(lastPoint.state.position);
            
            states.push({
                epoch: currentEpoch + this.timeStep,
                state: new StateVector(
                        newPosition.x, newPosition.y, newPosition.z,
                        newVelocity.x, newVelocity.y, newVelocity.z)
            });
        }
    }
}
