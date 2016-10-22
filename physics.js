
class PhysicalBodyModel
{
    constructor(mu, radius) {
        this.mu     = mu;     // gravitational parameter
        this.radius = radius;
    }
}

class Propagator
{
    /*constructor(referenceFrame, baseEpoch, baseState, timeStep) {
        this.trajectory = new TrajectoryStateArray(referenceFrame);
        this.trajectory.addState(baseEpoch, baseState);
        this.timeStep = timeStep;
    }*/

    constructor(significantBodies, timeStep) {
        this.significantBodies = significantBodies;
        this.timeStep = timeStep;
    }
    
    propagateTrajectory(trajectory, /* exitCondition */ exitTime) {
        const states = trajectory.states;
        for (let currentEpoch = states[states.length - 1].time; currentEpoch < exitTime; currentEpoch += this.timeStep) {
            const lastPoint = states[states.length - 1];
            
            let acceleration = ZERO_VECTOR;
            for (bodyIdId in this.significantBodies) {
                const body = BODIES[this.significantBodies[bodyIdId]];
                if (body.physicalModel.mu == 0) {
                    continue;
                }
                const rvec = body.trajectory.getPositionByEpoch(currentEpoch,
                        this.trajectory.referenceFrame).sub(lastPoint.position);
                const abs = rvec.abs();
                acceleration = rvec.mul(body.physicalModel.mu / abs / abs / abs).add(acceleration);
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
