import VisualTrajectoryModelAbstract from "./Abstract";
import {deg2rad} from "../../algebra";

export default class VisualTrajectoryModelStateArray extends VisualTrajectoryModelAbstract
{
    constructor(trajectory, referenceFrameId, color) {
        super(trajectory, color);
        this.minCos = Math.cos(deg2rad(1));
        this.referenceFrame = sim.starSystem.getReferenceFrame(referenceFrameId);
        this.showAhead = true;
        this.showAhead = false;
        this.showBehind = false;
        this.showBehind = true;
        this.trailLength = 300000000;
        this.minStep = 60;
    }

    render(epoch) {
        const endingBrightness = 0.35;
        const mainColor = new THREE.Color(this.color);
        let points = [];
        let colors = [];

        if (epoch > this.trajectory.minEpoch && epoch < this.trajectory.maxEpoch) {
            const pastPoints = this.getPoints(epoch, this.trajectory.minEpoch, -1, true);
            for (let i = pastPoints.points.length - 1; i >= 0; --i) {
                points.push(pastPoints.points[i]);
                colors.push(pastPoints.colors[i]);
            }
        }
        if (epoch > this.trajectory.minEpoch && (epoch < this.trajectory.maxEpoch && this.showAhead)) {
            const futurePoints = this.getPoints(epoch, this.trajectory.maxEpoch, 1, false);
            for (let i = 0; i < futurePoints.points.length; ++i) {
                points.push(futurePoints.points[i]);
                colors.push(futurePoints.colors[i]);
            }
        }
        this.threeObj.geometry.dispose();
        this.threeObj.geometry = (new THREE.Geometry()).setFromPoints(points);
        console.log(points.length);

        this.threeObj.geometry.colors = [];
        for (let i = 0; i < colors.length; i++) {
            let curColor = (new THREE.Color()).copy(mainColor);
            const mult = endingBrightness + (1 - endingBrightness) * colors[i];

            this.threeObj.geometry.colors.push(
                curColor.multiplyScalar(mult)
            );
        }

        this.threeObj.quaternion.copy(this.referenceFrame.getQuaternionByEpoch(epoch).toThreejs());
        this.threeObj.position.fromArray(sim.getVisualCoords(
            this.referenceFrame.getOriginPositionByEpoch(epoch)
        ));
    }

    getPoints(startEpoch, endEpoch, direction, isTrail) {
        const traj = this.trajectory;
        let step = direction * this.minStep;
        let isIncreasing = null;
        let curState = traj.getStateByEpoch(startEpoch, this.referenceFrame);
        let curVelocity = curState.velocity.unit_();
        let curEpoch = startEpoch;
        let points = [curState.position];
        let colors = [isTrail ? 1 : 0];
        let curTrailLength = 0;
        let i = 1;

        while (direction > 0 ? (curEpoch < endEpoch) : (curEpoch > endEpoch)) {
            let lastState;
            let lastEpoch;
            let lastDrMag;
            isIncreasing = null;
            let stepsLeft = 20;
            while (true) {
                const nextEpoch = (direction > 0 ? (curEpoch + step > endEpoch) : (curEpoch + step < endEpoch))
                    ? endEpoch
                    : curEpoch + step;
                step = nextEpoch - curEpoch;
                const newState = traj.getStateByEpoch(nextEpoch, this.referenceFrame);
                const dr = newState._position.sub(curState._position).mul_(direction);
                const drMag = dr.mag;
                let angleCos = dr.dot(curVelocity) / drMag;

                if (nextEpoch != endEpoch) {
                    const nextNextEpoch = (direction > 0 ? (nextEpoch + step > endEpoch) : (nextEpoch + step < endEpoch))
                        ? endEpoch
                        : nextEpoch + step;
                    const nextNewState = traj.getStateByEpoch(nextNextEpoch, this.referenceFrame);
                    const nextDr = nextNewState._position.sub(newState._position).mul_(direction);
                    angleCos = Math.min(angleCos, dr.dot(nextDr) / drMag / nextDr.mag);
                }

                // angle is too big
                if (angleCos < this.minCos) {
                    if (isIncreasing === true) {
                        break;
                    }
                    step /= 2;
                    isIncreasing = false;
                // angle is acceptable
                } else {
                    lastState = newState;
                    lastEpoch = nextEpoch;
                    lastDrMag = drMag;
                    if (isIncreasing === false || nextEpoch === endEpoch) {
                        break;
                    }
                    step *= 2;
                    isIncreasing = true;
                }

                --stepsLeft;
                if (stepsLeft === 0 || Math.abs(step) < this.minStep) {
                    if (lastState === undefined) {
                        lastState = newState;
                        lastEpoch = nextEpoch;
                        lastDrMag = drMag;
                    }
                    break;
                }
            }

            if (isTrail && !this.showBehind
                && (curTrailLength < this.trailLength)
                && (curTrailLength + lastDrMag > this.trailLength)
            ) {
                points[i] = (new THREE.Vector3()).fromArray(
                    traj.getStateByEpoch(
                        curEpoch + (lastEpoch - curEpoch) * (this.trailLength - curTrailLength) / lastDrMag,
                        this.referenceFrame
                    ).position
                );
                colors[i] = 0;
                break;
            }

            curTrailLength += lastDrMag;
            points[i] = new THREE.Vector3(
                lastState._position.x,
                lastState._position.y,
                lastState._position.z
            );
            if (isTrail) {
                colors[i] = Math.max(0, 1 - curTrailLength / this.trailLength);
            } else {
                colors[i] = 0;
            }
            curState = lastState;
            curVelocity = curState.velocity.unit_();
            curEpoch = lastEpoch;
            i++;
        }

        return {
            points: points,
            colors: colors
        };
    }
}