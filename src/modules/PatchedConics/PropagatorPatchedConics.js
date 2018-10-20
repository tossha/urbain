import PropagatorAbstract from "../../core/Propagator/Abstract";
import TrajectoryComposite from "../../core/Trajectory/Composite";
import ReferenceFrameFactory, {ReferenceFrame} from "../../core/ReferenceFrame/Factory";
import TrajectoryKeplerianBasic from "../../core/Trajectory/KeplerianBasic";
import KeplerianObject from "../../core/KeplerianObject";
import VisualTrajectoryModelKeplerian from "../../core/visual/Trajectory/Keplerian";
import {getAngleIntervalsIntersection, getEpochIntervalsIntersection, TWO_PI} from "../../core/algebra";
import { sim } from "../../core/Simulation";
import FlightEventSOIArrival from "./FlightEvent/SOIArrival";
import FlightEventSOIDeparture from "./FlightEvent/SOIDeparture";
// import VisualPoint from "../../visual/Point";
// import Constant from "../../core/FunctionOfEpoch/Constant";

export default class PropagatorPatchedConics extends PropagatorAbstract
{
    constructor() {
        super();
        this.soiSafetyCoefficient = 1.5;
        this.maxStep = 3600;
        this.minStepCount = 100;
        this.maxPatchError = 1e-3; // 1 meter
        // this.debugPoints = [];
    }

    propagate(trajectory, epochFrom, stopCondition) {
        if (!trajectory instanceof TrajectoryComposite) {
            throw new Error('Patched conics propagation requires TrajectoryComposite instance');
        }
        if (!stopCondition.epoch) {
            throw new Error('Patched conics propagation requires epoch in stop condition');
        }

        trajectory.clearAfterEpoch(epochFrom);

        let lastComponent = trajectory.getComponentByEpoch(epochFrom);
        let epoch = Math.max(epochFrom, lastComponent.epoch);
        let nextComponentData;

        lastComponent.maxEpoch = false;
/*
        for (let point of this.debugPoints) {
            point.drop();
        }
        this.debugPoints = [];
*/
        // console.log('Propagating...');

        do {
            // console.log('Looking for next component...');
            nextComponentData = this._findNextTrajectory(lastComponent, epoch, stopCondition.epoch);
            if (nextComponentData) {
                // console.log('Component found', nextComponentData);
                trajectory.addComponent(nextComponentData.trajectory);

                lastComponent.addFlightEvent(new FlightEventSOIDeparture(
                    nextComponentData.epoch,
                    nextComponentData.oldSoi,
                    nextComponentData.newSoi
                ));

                epoch = nextComponentData.epoch;
                lastComponent.maxEpoch = epoch;
                lastComponent = nextComponentData.trajectory;

                lastComponent.addFlightEvent(new FlightEventSOIArrival(
                    nextComponentData.epoch,
                    nextComponentData.oldSoi,
                    nextComponentData.newSoi
                ));
            }
        } while (nextComponentData && epoch < stopCondition.epoch);
    }

    _findNextTrajectory(trajectory, epochFrom, epochTo) {
        const soi = sim.starSystem.getObject(trajectory.referenceFrame.originId);
        const ownSoiCrossing   = this._findOwnSoiCrossing  (soi, trajectory, epochFrom);
        const childSoiCrossing = this._findChildSoiCrossing(soi, trajectory, epochFrom, epochTo);

        if (childSoiCrossing === false && ownSoiCrossing === false) {
            return false;
        }

        let nextSoiCrossing = (!childSoiCrossing || (ownSoiCrossing && ownSoiCrossing.epoch < childSoiCrossing.epoch))
            ? ownSoiCrossing
            : childSoiCrossing;

        return {
            trajectory: this._createExtensionTrajectory(trajectory, nextSoiCrossing.newSoi, nextSoiCrossing.epoch),
            oldSoi: soi,
            newSoi: nextSoiCrossing.newSoi,
            epoch: nextSoiCrossing.epoch
        };
    }

    _findOwnSoiCrossing(parent, trajectory, epochFrom) {
        const ko = trajectory.keplerianObject;
        const sphereCrossing = ko.getSphereCrossingTrueAnomaly(parent.data.patchedConics.soiRadius);

        if (!sphereCrossing) {
            return false;
        }

        let epoch = ko.getEpochByTrueAnomaly(sphereCrossing[0]);
        while (epoch < epochFrom) {
            epoch += ko.period;
        }

        return {
            epoch: epoch,
            newSoi: parent.data.patchedConics.parentSoi
        };
    }

    _findChildSoiCrossing(parent, trajectory, epochFrom, epochTo) {
        const ko = trajectory.keplerianObject;
        let crossings = [];

        for (let soi of parent.data.patchedConics.childSois) {
            const childKo = soi.trajectory.getKeplerianObjectByEpoch(epochFrom, trajectory.referenceFrame);
            const soiRadius = soi.data.patchedConics.soiRadius;
            const intervals1 = this._getPotentialApproachIntervals(childKo, ko, epochFrom, epochTo, soiRadius * this.soiSafetyCoefficient);
            if (intervals1 === false) {
                continue;
            }

            const intervals2 = this._getPotentialApproachIntervals(ko, childKo, epochFrom, epochTo, soiRadius * this.soiSafetyCoefficient);
/*
            if (this.debugPoints.length === 0) {
                if (intervals1 && intervals1 instanceof Array)
                    for (let interval of intervals1) {
                        this.debugPoints.push(new VisualPoint(new Constant(trajectory.getPositionByEpoch(interval[0], 39901000).add_(parent.getPositionByEpoch(sim.currentEpoch))), 'blue', 6));
                        this.debugPoints.push(new VisualPoint(new Constant(trajectory.getPositionByEpoch(interval[1], 39901000).add_(parent.getPositionByEpoch(sim.currentEpoch))), 'blue', 10));
                    }

                if (intervals2 && intervals2 instanceof Array)
                    for (let interval of intervals2) {
                        this.debugPoints.push(new VisualPoint(new Constant(soi.trajectory.getPositionByEpoch(interval[0], 39901000).add_(parent.getPositionByEpoch(sim.currentEpoch))), 'yellow', 6));
                        this.debugPoints.push(new VisualPoint(new Constant(soi.trajectory.getPositionByEpoch(interval[1], 39901000).add_(parent.getPositionByEpoch(sim.currentEpoch))), 'yellow', 10));
                    }
            }
*/
            let potentialApproachIntervals = getEpochIntervalsIntersection(intervals1, intervals2);

            if (potentialApproachIntervals === false) {
                continue;
            }
            if (potentialApproachIntervals === true) {
                // TODO optimize this case
                potentialApproachIntervals = [[epochFrom, epochTo]];
            }

            potentialApproachIntervals.sort((i1, i2) => (i1[0] < i2[0]) ? -1 : (i1[0] > i2[0] ? 1 : 0));

            let crossingFound = false;
            // console.log('Iterating...');
            for (let interval of potentialApproachIntervals) {
                if (interval[0] > epochTo) {
                    break;
                }
                if (interval[1] < epochFrom) {
                    continue;
                }
                if (interval[0] < epochFrom) {
                    interval[0] = epochFrom;
                }
                if (interval[1] > epochTo) {
                    interval[1] = epochTo;
                }
                let isFirstStep = true;
                let step = Math.min(this.maxStep, (interval[1] - interval[0]) / this.minStepCount);
                let t = interval[0];
                let prevDistance = 0;
                // console.log('Iterating interval...', interval[1] - interval[0], step);
                while (t < interval[1]) {
                    let distance = trajectory.getPositionByEpoch(t).sub_(soi.getPositionByEpoch(t)).mag - soiRadius;
                    // console.log('T Distance', t, distance);
                    if (distance < 0) { // found a point in time when we are inside SOI
                        // console.log('Found');
                        if (isFirstStep) {
                            // console.log('Iterating forward');
                            do {
                                t += step;
                                if (t > interval[1]) {
                                    t = interval[1];
                                }
                                distance = trajectory.getPositionByEpoch(t).sub_(soi.getPositionByEpoch(t)).mag - soiRadius;
                            } while (distance < 0 && t < interval[1]);
                            // console.log('Distance', distance);
                            if (distance < 0) {
                                break;
                            }
                            continue;
                        }
                        // console.log('Looking for boundary');
                        while (Math.abs(distance) > this.maxPatchError) { // looking for SOI crossing time now
                            step *= distance / (prevDistance - distance);
                            t += step;
                            prevDistance = distance;
                            distance = trajectory.getPositionByEpoch(t).sub_(soi.getPositionByEpoch(t)).mag - soiRadius;
                            // console.log('T Step distance', t, step, distance);
                        }
                        // console.log('Boundary found', t);
                        crossings.push({
                            epoch: t,
                            newSoi: soi
                        });
                        crossingFound = true;
                        break;
                    }
                    prevDistance = distance;
                    isFirstStep = false;
                    t += step;
                }

                if (crossingFound) {
                    break;
                }
                // console.log('Crossing not found');
            }
        }

        if (!crossings.length) {
            return false;
        }

        let closestCrossing = crossings[0];
        for (let crossing of crossings) {
            if (crossing.epoch < closestCrossing.epoch) {
                closestCrossing = crossing;
            }
        }

        return closestCrossing;
    }

    _getPotentialApproachIntervals(keplerianObjectBase, keplerianObjectActive, epochFrom, epochTo, distance) {
        const radialTa = this._getRadialTaBounds(keplerianObjectBase, keplerianObjectActive, distance);
        if (radialTa === false) {
            return false;
        }

        const verticalTa = this._getVerticalTaBounds(keplerianObjectBase, keplerianObjectActive, distance);
        let taIntervals;

        if (verticalTa) {
            taIntervals = getAngleIntervalsIntersection(verticalTa, radialTa);
        } else {
            if (radialTa === true) {
                return true;
            } else {
                taIntervals = radialTa;
            }
        }

        if (taIntervals === false) {
            return false;
        }

        const period = keplerianObjectActive.period;
        let inEpoch, outEpoch;
        let adding = keplerianObjectActive.isElliptic
            ? Math.floor((epochFrom - keplerianObjectActive.epoch) / period) * period
            : 0;
        let maxProcessedEpoch = 0;
        let epochIntervals = [];

        do {
            for (let taInterval of taIntervals) {
                inEpoch = keplerianObjectActive.getEpochByTrueAnomaly(taInterval[0]) + adding;
                outEpoch = keplerianObjectActive.getEpochByTrueAnomaly(taInterval[1]) + adding;

                if (outEpoch < inEpoch) {
                    inEpoch -= period;
                }

                if (outEpoch > maxProcessedEpoch) {
                    maxProcessedEpoch = outEpoch;
                }
                if (outEpoch < epochFrom) {
                    continue;
                }

                if (epochIntervals.length > 10000) {
                    debugger;
                    throw new Error('Infinite loop detected');
                }

                epochIntervals.push([inEpoch, outEpoch]);
            }
            adding += period;

        } while (maxProcessedEpoch < epochTo && keplerianObjectActive.isElliptic);

        return epochIntervals;
    }

    _getVerticalTaBounds(keplerianObjectBase, keplerianObjectActive, distance) {
        // this is only to recalculate inc, raan and aop. probably can be optimized.
        const baseNormal = keplerianObjectBase.getNormalVector();
        const activeNormal = keplerianObjectActive.getNormalVector();
        const equinoxVector = keplerianObjectBase.getPeriapsisVector();
        const raanVector = baseNormal.cross(activeNormal);
        const periapsisVector = keplerianObjectActive.getPeriapsisVector();

        const inc = baseNormal.angle(activeNormal);
        let raan = raanVector.angle(equinoxVector);
        if (equinoxVector.cross(raanVector).angle(baseNormal) > Math.PI / 2) {
            raan = TWO_PI - raan;
        }
        let aop = raanVector.angle(periapsisVector);
        if (raanVector.cross(periapsisVector).angle(activeNormal) > Math.PI / 2) {
            aop = TWO_PI - aop;
        }

        const relKeplerianObject = new KeplerianObject(
            keplerianObjectActive.ecc,
            keplerianObjectActive.sma,
            aop,
            inc,
            raan,
            keplerianObjectActive.m0,
            keplerianObjectActive.epoch,
            keplerianObjectActive.mu,
            false
        );

        return relKeplerianObject.getPlaneCrossingTrueAnomaly(distance);
    }

    _getRadialTaBounds(keplerianObjectBase, keplerianObjectActive, distance) {
        const r1 = keplerianObjectBase.getPeriapsisRadius() - distance;
        const r2 = keplerianObjectBase.getApoapsisRadius()  + distance;
        const radialTa1 = keplerianObjectActive.getSphereCrossingTrueAnomaly(r1);
        const radialTa2 = keplerianObjectActive.getSphereCrossingTrueAnomaly(r2);

        if (keplerianObjectBase.isHyperbolic) {
            if (keplerianObjectActive.isHyperbolic) {
                return radialTa1
                    ? [[-Infinity, radialTa1[1] - TWO_PI],[radialTa1[0], Infinity]]
                    : true;
            } else {
                return radialTa1
                    ? [radialTa1]
                    : (keplerianObjectActive.getApoapsisRadius() >= r1);
            }
        }
        // keplerianObjectBase is elliptic

        if (keplerianObjectActive.isHyperbolic) {
            if (!radialTa2) {
                return false;
            } else if (!radialTa1) {
                return [[radialTa2[1] - TWO_PI, radialTa2[0]]];
            }
            return [
                [radialTa2[1] - TWO_PI, radialTa1[1] - TWO_PI],
                [radialTa1[0], radialTa2[0]],
            ];
        }
        // keplerianObjectActive is elliptic

        if (radialTa1) {
            return radialTa2
                ? [[radialTa1[0], radialTa2[0]], [radialTa2[1], radialTa1[1]]]
                : [radialTa1];
        } else if (radialTa2) {
            return [[radialTa2[1], radialTa2[0]]];
        }
        return keplerianObjectActive.getPeriapsisRadius() < r2
            && keplerianObjectActive.getApoapsisRadius()  > r1;
    }

    _createExtensionTrajectory(originalTrajectory, newSoiBody, epoch) {
        let newReferenceFrame = sim.starSystem.getReferenceFrame(ReferenceFrameFactory.buildId(newSoiBody.id, ReferenceFrame.INERTIAL_ECLIPTIC));
        let newSoiState = newReferenceFrame.stateVectorFromBaseReferenceFrameByEpoch(
            epoch,
            originalTrajectory.getStateByEpoch(epoch)
        );

        let traj = new TrajectoryKeplerianBasic(
            newReferenceFrame.id,
            KeplerianObject.createFromState(
                newSoiState,
                newSoiBody.physicalModel.mu,
                epoch
            )
        );
        traj.minEpoch = epoch;
        traj.maxEpoch = false;
        traj.isEditable = false;

        // TODO refactor this
        traj.setVisualModel(new VisualTrajectoryModelKeplerian(
            traj,
            {color: originalTrajectory.visualModel.config.color, minEpoch: false, maxEpoch: 'copy'}
        ));

        return traj;
    }

}
