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
import EphemerisObject from "../../core/EphemerisObject";
// import VisualPoint from "../../visual/Point";
// import Constant from "../../core/FunctionOfEpoch/Constant";

export default class PropagatorPatchedConics extends PropagatorAbstract
{
    constructor() {
        super();
        this.soiSafetyCoefficient = 1.5;
        this.maxPatchError = 1e-3; // 1 meter
        // this.debugPoints = [];
    }

    propagate(trajectory, epochFrom) {
        if (!trajectory instanceof TrajectoryComposite) {
            throw new Error('Patched conics propagation requires TrajectoryComposite instance');
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
            // console.log('\tLooking for next component...');
            nextComponentData = this._findNextTrajectory(lastComponent, epoch + 1);
            if (nextComponentData) {
                // console.log('\tComponent found', nextComponentData);
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
        } while (nextComponentData);
        // console.log('Propagation ended');
    }

    _findNextTrajectory(trajectory, epochFrom) {
        const soi = sim.starSystem.getObject(trajectory.referenceFrame.originId);
        const childSoiCrossing = this._findChildSoiCrossing(soi, trajectory, epochFrom, epochFrom + trajectory.period);
        const ownSoiCrossing   = (soi.type !== EphemerisObject.TYPE_STAR)
            ? this._findOwnSoiCrossing(soi, trajectory, epochFrom)
            : false;

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

        if (ko.isHyperbolic && epochFrom === epochTo) {
            let maxDistance = 0;
            for (let soi of parent.data.patchedConics.childSois) {
                const distance = soi.trajectory
                    .getKeplerianObjectByEpoch(epochFrom, trajectory.referenceFrame)
                    .getApoapsisRadius() + soi.data.patchedConics.soiRadius * this.soiSafetyCoefficient;
                if (distance > maxDistance) {
                    maxDistance = distance;
                }
            }
            if (maxDistance === 0) {
                return false;
            }
            const ta = ko.getSphereCrossingTrueAnomaly(maxDistance);
            epochTo = ko.getEpochByTrueAnomaly(ta[0]);
        }

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
                potentialApproachIntervals = [[epochFrom, epochTo]];
            }

            // Sorting the intervals so we can break the loop when we
            // see an encounter and be sure that it's a closest one
            potentialApproachIntervals.sort((i1, i2) => (i1[0] < i2[0]) ? -1 : (i1[0] > i2[0] ? 1 : 0));

            // console.log('\t\tIteration started, SOI', soiRadius);
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
                let step = (ko.isElliptic && childKo.isElliptic)
                    ? Math.min(Math.min(ko.period, childKo.period), interval[1] - interval[0]) / 10
                    : (interval[1] - interval[0]) / 10;
                let t1, t2, t = interval[0];
                let prevDR = false;
                let found = false;

                // Distance between two objects
                const getR = (states) => {
                    return states[0].position.sub_(states[1]._position).mag;
                };
                // Distance derivative - rate of change of the distance between two objects
                const getDR = (states, r) => {
                    return (states[0]._position.mag * states[0]._velocity.projectionOn(states[0]._position)
                          + states[1]._position.mag * states[1]._velocity.projectionOn(states[1]._position)
                          - states[1]._position.dot(states[0]._velocity)
                          - states[0]._position.dot(states[1]._velocity)) / r;
                };
                const getStates = (t) => [
                    trajectory.getStateInOwnFrameByEpoch(t),
                    soi.getStateByEpoch(t, trajectory.referenceFrame)
                ];

                // console.log('\t\t\tInterval', interval[1] - interval[0], 'step', step);

                // Purpose of this loop is to find a point inside soi
                // (epoch t2) and a point outside the soi (epoch t1),
                // where t1 < t2, or establish that there's no such point.
                while (t < interval[1]) {
                    let states = getStates(t);
                    let r = getR(states);

                    // console.log('\t\t\t\tStep start, t:', t - interval[0], 'R', r, 'dR', getDR(states, r), 'R+1', getR(getStates(t+1)));

                    if (r < soiRadius) {
                        t1 = t - step;
                        t2 = t;
                        found = true;
                        // console.log('\t\t\t\t\tFound 1');
                        break;
                    }

                    let dR = getDR(states, r);

                    // If the distance was decreasing on the last step and now it's increasing
                    // then we just passed local minimum, so wee need to find it and check.
                    // We're looking for the minimum in a loop. We break that loop when we
                    // find a distance smaller than soiRadius or we find the minimum and
                    // it's bigger than soiRadius which means there's no encounter.
                    if (prevDR !== false && prevDR < 0 && dR > 0) {
                        t1 = t - step;
                        t2 = t;
                        let t0, dR0;
                        let dR1 = prevDR; // dR1 is always negative
                        let dR2 = dR;     // dR1 is always positive

                        // console.log('\t\t\t\t\tPassed minimum, looking for it');

                        do {
                            t0 = t1 + (t2 - t1) * dR1 / (dR1 - dR2);

                            states = getStates(t0);
                            r = getR(states);

                            // console.log('\t\t\t\t\t\tt0', t0, 'R', r, 'dR', getDR(states, r));

                            if (r < soiRadius) {
                                t2 = t0;
                                found = true;
                                // console.log('\t\t\t\t\t\t\tFound 2');
                                break;
                            }

                            dR0 = getDR(states, r);

                            if (dR0 > 0) {
                                t2 = t0;
                                dR2 = dR0;
                            } else {
                                t1 = t0;
                                dR1 = dR0;
                            }

                            // console.log('\t\t\t\t\t\tt1', t1, 't2', t2);
                        // Local minimum condition:
                        // distance derivative is smaller than 1 mm/s
                        // or t2 - t1 is smaller than 1 second
                        } while (Math.abs(dR0) > 1e-6 && (t2 - t1 > 1));

                        if (found) {
                            break;
                        }

                        // console.log('\t\t\t\t\tMinimum is greater than soiRadius');
                    }

                    prevDR = dR;
                    t += step;
                } // iterating interval end

                // At his point we have three relevant variables:
                // `found` indicates whether or not we found a point
                // inside soi, and if we did we have epoch `t2` inside
                // soi and `t1` outside soi where `t1` < `t2`. Also, `t1`
                // may be less than `interval[0]`, which means we
                // encountered a point inside soi on the very first step

                if (!found) {
                    continue;
                }

                if (t1 < interval[0]) {
                    crossings.push({
                        epoch: interval[0],
                        newSoi: soi
                    });
                    break;
                }

                let d;
                let d1 = getR(getStates(t1)) - soiRadius; // d1 is always positive
                let d2 = getR(getStates(t2)) - soiRadius; // d2 is always negative

                do {
                    t = t1 + (t2 - t1) * d1 / (d1 - d2);

                    d = getR(getStates(t)) - soiRadius;

                    if (d < 0) {
                        t2 = t;
                        d2 = d;
                    } else {
                        t1 = t;
                        d1 = d;
                    }
                } while (Math.abs(d) > this.maxPatchError);

                crossings.push({
                    epoch: t,
                    newSoi: soi
                });
                break;

            } // intervals loop end
        } // soi loop end

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
