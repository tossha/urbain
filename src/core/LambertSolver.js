import {acosSigned, Vector, Quaternion, newtonSolve} from "./algebra";
import KeplerianObject from "./KeplerianObject";
import EphemerisObject from "./EphemerisObject";
import ReferenceFrameFactory, {ReferenceFrame} from "./ReferenceFrame/Factory";
import Body from "./Body";
import StateVector from "./StateVector";
import TrajectoryComposite from "./Trajectory/Composite";
import TrajectoryKeplerianBasic from "./Trajectory/KeplerianBasic";
import { sim } from "./simulation-engine";

export default class LambertSolver
{
    static getPlotData(orbit1, orbit2, epochMin, epochMax, transferMin, transferMax, points) {
        const epochStep = (epochMax - epochMin) / (points - 1);
        const flightTimeStep = (transferMax - transferMin) / (points - 1);
        let result = [];
        let startEpoch = epochMin;
        let i = 0;

        while (startEpoch <= epochMax) {
            let flightTime = transferMin;
            let j = 0;

            result[i] = [];
            while (flightTime <= transferMax) {
                let res = this.calcDeltaV(
                    orbit1.getStateByEpoch(startEpoch),
                    orbit2.getStateByEpoch(startEpoch + flightTime),
                    startEpoch,
                    flightTime,
                    orbit1.mu
                );
                result[i][j] = res;
                flightTime += flightTimeStep;
                j++;

            }
            startEpoch += epochStep;
            i++;
        }
        return result;
    }

    static plot(plotData) {
        let min = 1e99, max = 0;
        let ctx = document.getElementById('lambertCanvas').getContext('2d');

        ctx.clearRect(0, 0, 300, 300);

        for (let row of plotData) {
            for (let res of row) {
                if (res === false) {
                    continue;
                }
                if (res < min) {
                    min = res;
                }
                if (res > max) {
                    max = res;
                }
            }
        }

        for (let row in plotData) {
            for (let col in plotData[row]) {
                const res = plotData[row][col];
                if (res === false) {
                    ctx.fillStyle = "rgba(255,0,0,1)";
                } else {
                    const color = Math.round((1 - (res - min) / (max - min)) * 255);
                    ctx.fillStyle = "rgba(" + color + "," + color + "," + color + ", 1)";
                }
                ctx.fillRect(0|row, 0|col, 1, 1);
            }
        }
    }

    static getDeltaV(state1, state2, transferOrbit, epoch1, epoch2) {
        return state1.velocity.sub_(transferOrbit.getStateByEpoch(epoch1)._velocity).mag +
            state2.velocity.sub_(transferOrbit.getStateByEpoch(epoch2)._velocity).mag;
    }

    static calcDeltaV(state1, state2, startEpoch, flightTime, mu) {
        const transferOrbit = this.solve(state1, state2, startEpoch, flightTime, mu);

        if (!transferOrbit) {
            return false;
        }

        return this.getDeltaV(state1, state2, transferOrbit, startEpoch, startEpoch + flightTime);
    }

    static findBestTransfer(originObject, targetObject, rPer1, rPer2, departureTime, flightTimeMin, flightTimeMax) {
        const d = (flightTimeMax - flightTimeMin) * 1e-6;
        const getDiff = (flightTime) => {
            if (flightTime < flightTimeMin) {
                return null;
            }
            if (flightTime > flightTimeMax) {
                return null;
            }
            const v1 = this.solveFullTransfer(originObject, targetObject, rPer1, rPer2, departureTime, flightTime - d/2);
            const v2 = this.solveFullTransfer(originObject, targetObject, rPer1, rPer2, departureTime, flightTime + d/2);

            if (v1 === null || v2 === null) {
                return null;
            }

            return (v2.totalDeltaV - v1.totalDeltaV) / d;
        };

        const stepCount = 50;
        const step = (flightTimeMax - flightTimeMin) / (stepCount - 1);

        let minDeltaV = 1e100;
        let bestFlightTime;

        for (let flightTime = flightTimeMin; flightTime <= flightTimeMax; flightTime += step) {
            const transfer = this.solveFullTransfer(originObject, targetObject, rPer1, rPer2, departureTime, flightTime);
            if (transfer === null) {
                continue;
            }
            const deltaV = transfer.totalDeltaV;
            // console.log(flightTime, deltaV);
            if (deltaV < minDeltaV) {
                bestFlightTime = flightTime;
                minDeltaV = deltaV;
            }
        }

        bestFlightTime = newtonSolve(getDiff, bestFlightTime, step * 1e-3, 1e-6, 10);

        if (bestFlightTime === null) {
            return {totalDeltaV: null};
        }

        return this.solveFullTransfer(originObject, targetObject, rPer1, rPer2, departureTime, bestFlightTime);
    }

    static solveFullTransfer(originObject, targetObject, rPer1, rPer2, departureTime, flightTime) {
        if (flightTime <= 0) {
            return null;
        }

        const parentObject = sim.getModule('PatchedConics').getCommonParent(originObject.id, targetObject.id);

        if (!(parentObject instanceof Body)) {
            return null;
        }

        const rfMainId = ReferenceFrameFactory.buildId(
            parentObject.id,
            (parentObject.type === EphemerisObject.TYPE_STAR)
                ? ReferenceFrame.INERTIAL_ECLIPTIC
                : ReferenceFrame.INERTIAL_BODY_EQUATORIAL
        );
        const rfMain = sim.starSystem.getReferenceFrame(rfMainId);

        const mu = parentObject.physicalModel.mu;

        let state1;
        let state2;

        let calcOriginSoi = originObject instanceof Body;
        let calcTargetSoi = targetObject instanceof Body;

        let rfOrigin;
        let rfTarget;
        let originSoi;
        let targetSoi;

        if (calcOriginSoi) {
            rfOrigin = sim.starSystem.getReferenceFrame(ReferenceFrameFactory.buildId(originObject.id, ReferenceFrame.INERTIAL_BODY_EQUATORIAL));
            originSoi = originObject.data.patchedConics.soiRadius;
        }
        if (calcTargetSoi) {
            targetSoi = targetObject.data.patchedConics.soiRadius;
            rfTarget = sim.starSystem.getReferenceFrame(ReferenceFrameFactory.buildId(targetObject.id, ReferenceFrame.INERTIAL_BODY_EQUATORIAL));
        }

        let ejectionTime = 0;
        let insertionTime = 0;
        let ejectionPosShift = new Vector(3);
        let insertionPosShift = new Vector(3);
        let ejectionVelInf;
        let insertionVelInf;
        let steps = 0;
        let transferKO;
        let ejectionSoiEpoch;
        let insertionSoiEpoch;

        while (true) {
            ejectionSoiEpoch = departureTime + ejectionTime;
            insertionSoiEpoch = departureTime + flightTime - insertionTime;

            state1 = originObject.trajectory.getStateByEpoch(ejectionSoiEpoch, rfMain);
            if (calcOriginSoi) {
                state1._position = rfOrigin.transformPositionByEpoch(ejectionSoiEpoch, ejectionPosShift, rfMain);
            }

            state2 = targetObject.trajectory.getStateByEpoch(insertionSoiEpoch, rfMain);
            if (calcTargetSoi) {
                state2._position = rfTarget.transformPositionByEpoch(insertionSoiEpoch, insertionPosShift, rfMain);
            }

            transferKO = this.solve(state1, state2, ejectionSoiEpoch, insertionSoiEpoch - ejectionSoiEpoch, mu);
            if (transferKO === null) {
                return null;
            }

            steps++;

            let ejectionPosTime = [new Vector(3), 0];
            let insertionPosTime = [new Vector(3), 0];

            if (calcOriginSoi) {
                ejectionVelInf = transferKO.getStateByEpoch(ejectionSoiEpoch)._velocity.sub_(state1._velocity);
                const ejectionNormal  = state1._position.cross(ejectionVelInf);
                ejectionPosTime = this.getSoiEdgePositionAndTime(
                    rfMain.rotateVectorByEpoch(ejectionSoiEpoch, ejectionVelInf, rfOrigin),
                    rfMain.rotateVectorByEpoch(ejectionSoiEpoch, ejectionNormal, rfOrigin),
                    rPer1,
                    originSoi,
                    originObject.physicalModel.mu,
                    1
                );
                ejectionTime = ejectionPosTime[1];
            }

            if (calcTargetSoi) {
                insertionVelInf = transferKO.getStateByEpoch(insertionSoiEpoch)._velocity.sub_(state2._velocity);
                const insertionNormal = state2._position.cross(insertionVelInf);
                insertionPosTime = this.getSoiEdgePositionAndTime(
                    rfMain.rotateVectorByEpoch(insertionSoiEpoch, insertionVelInf, rfTarget),
                    rfMain.rotateVectorByEpoch(insertionSoiEpoch, insertionNormal, rfTarget),
                    rPer2,
                    targetSoi,
                    targetObject.physicalModel.mu,
                    -1
                );
                insertionTime = insertionPosTime[1];
            }

            if (steps > 10
                || (
                    (!calcOriginSoi || ejectionPosShift.sub(ejectionPosTime[0]).mag < 10)
                    && (!calcTargetSoi || insertionPosShift.sub(insertionPosTime[0]).mag < 10)
                )
            ) {
                ejectionPosShift = ejectionPosTime[0];
                insertionPosShift = insertionPosTime[0];
                break;
            }

            ejectionPosShift = ejectionPosTime[0];
            insertionPosShift = insertionPosTime[0];
        }

        let ejectionDeltaV = 0;
        let insertionDeltaV = 0;
        let trajectory = new TrajectoryComposite();

        const transfer = new TrajectoryKeplerianBasic(rfMainId, transferKO);
        transfer.minEpoch = departureTime + ejectionTime;
        transfer.maxEpoch = departureTime + flightTime - insertionTime;
        trajectory.addComponent(transfer);

        if (calcOriginSoi) {
            const ejectionKO = KeplerianObject.createFromState(
                new StateVector(ejectionPosShift, rfMain.rotateVectorByEpoch(ejectionSoiEpoch, ejectionVelInf, rfOrigin)),
                originObject.physicalModel.mu,
                departureTime + ejectionTime
            );
            ejectionDeltaV = ejectionKO.getPeriapsisSpeed() - Math.sqrt(originObject.physicalModel.mu / ejectionKO.getPeriapsisRadius());
            const ejection = new TrajectoryKeplerianBasic(rfOrigin.id, ejectionKO);
            ejection.minEpoch = departureTime;
            ejection.maxEpoch = departureTime + ejectionTime;
            trajectory.addComponent(ejection);
        } else {
            ejectionDeltaV = state1.velocity.sub(transferKO.getStateByEpoch(departureTime)._velocity).mag;
        }

        if (calcTargetSoi) {
            const insertionKO = KeplerianObject.createFromState(
                new StateVector(insertionPosShift, rfMain.rotateVectorByEpoch(insertionSoiEpoch, insertionVelInf, rfTarget)),
                targetObject.physicalModel.mu,
                departureTime + flightTime - insertionTime
            );
            insertionDeltaV = insertionKO.getPeriapsisSpeed() - Math.sqrt(targetObject.physicalModel.mu / insertionKO.getPeriapsisRadius());
            const insertion = new TrajectoryKeplerianBasic(rfTarget.id, insertionKO);
            insertion.minEpoch = departureTime + flightTime - insertionTime;
            insertion.maxEpoch = departureTime + flightTime;
            trajectory.addComponent(insertion);
        } else {
            insertionDeltaV = state2.velocity.sub(transferKO.getStateByEpoch(departureTime + flightTime)._velocity).mag;
        }

        return {
            trajectory: trajectory,
            ejectionDeltaV: ejectionDeltaV,
            insertionDeltaV: insertionDeltaV,
            totalDeltaV: ejectionDeltaV + insertionDeltaV,
        };
    }

    static getSoiEdgePositionAndTime(velInf, normal, rPer, rInf, mu, direction) {
        const sma = 1 / (2 / rInf - velInf.quadrance / mu);
        const ecc = 1 - rPer / sma;
        const trueAnomaly = direction * Math.acos((sma * (1 - ecc*ecc) / rInf - 1) / ecc);
        const flightPathAngle = Math.atan(ecc * Math.sin(trueAnomaly) / (sma * (1 - ecc*ecc) / rInf));
        const position = (new Quaternion(normal, flightPathAngle - Math.PI / 2)).rotate_(velInf.unit().mul_(rInf));

        const H = this.getEccentricAnomalyByTrueAnomaly(trueAnomaly, ecc);
        const time = (ecc > 1)
            ? (ecc * Math.sinh(H) - H) / Math.sqrt(mu / sma / sma / Math.abs(sma))
            : (H - ecc * Math.sin(H)) / Math.sqrt(mu / sma / sma / sma);

        return [position, Math.abs(time)];
    }

    static solve(state1, state2, startEpoch, flightTime, mu) {
        const maxError = 1;
        const maxSteps = 30;

        const r1vec = state1.position;
        const r2vec = state2.position;
        let normal = r1vec.cross(r2vec);
        const r1 = r1vec.mag;
        const r2 = r2vec.mag;
        let transferAngle = r1vec.angle(r2vec);

        if (normal.angle(state1._position.cross(state1._velocity)) > Math.PI / 2) {
            transferAngle = 2 * Math.PI - transferAngle;
            normal.mul_(-1);
        }

        const signSinTransferAngle = Math.sign(Math.sin(transferAngle));
        const inc = normal.angle(new Vector([0, 0, 1]));
        const nodeVector = (new Vector([0, 0, 1])).cross(normal);

        let e, sma, ta1;
        let raan = nodeVector.angle(new Vector([1, 0, 0]));
        if ((new Vector([1, 0, 0])).cross(nodeVector).angle(new Vector([0, 0, 1])) > Math.PI / 2) {
            raan = 2 * Math.PI - raan;
        }

        const d = Math.sqrt(r1*r1 + r2*r2 - 2 * r1vec.dot(r2vec)) / 2;

        const parabolicTime = (Math.pow(r1+r2+2*d, 3/2) - signSinTransferAngle*Math.pow(r1+r2-2*d, 3/2)) / (6 * Math.sqrt(mu));

        if (flightTime > parabolicTime) {
            // ellipse
            const A = (r2 - r1) / 2;
            const E = d / A;
            const B = Math.sqrt(d*d - A*A);
            let y = newtonSolve(
                (yParam) => this.getTimeByY(yParam, A, B, E, r1, r2, d, transferAngle, mu) - flightTime,
                10000, 1, maxError, maxSteps
            );

            if (y === null) {
                return null;
            }

            const x0 = -(r2 + r1) / 2 / E;
            const y0 = B * Math.sqrt(x0 * x0 / A / A - 1);
            const x = A * Math.sqrt(1 + y * y / B / B);
            const temp = Math.sqrt((x0 - x) * (x0 - x) + (y0 - y) * (y0 - y));
            const fx = (x0 - x) / temp;
            const fy = (y0 - y) / temp;
            ta1 = acosSigned(
                -((x0 + d) * fx + y0 * fy) / r1,
                signSinTransferAngle * ((x0 + d) * fy - y0 * fx)
            );
            sma = E * (x - x0) / 2;
            e = temp / 2 / sma;

        } else {
            // hyperbola
            sma = newtonSolve(
                (a) => {
                    const alpha = Math.acosh(1 + (r1 + r2 + 2 * d) / 2 / Math.abs(a));
                    const beta  = Math.acosh(1 + (r1 + r2 - 2 * d) / 2 / Math.abs(a));
                    return Math.sqrt(Math.abs(Math.pow(a, 3)) / mu) *
                        (Math.sinh(alpha) - alpha - signSinTransferAngle * (Math.sinh(beta) - beta)) - flightTime;
                },
                r1, 10, maxError, maxSteps
            );

            if (sma === null) {
                return null;
            }

            if (sma > 0) {
                sma = -sma;
            }

            let f1 = r1vec.rotate(nodeVector, -inc).mul_(-1);
            let p2 = r2vec.rotate(nodeVector, -inc).add_(f1);
            const d1 = r1 - 2 * sma;
            const d2 = r2 - 2 * sma;
            const tempAng = -Math.sign(p2.y) * p2.angle(new Vector([1,0,0]));
            f1 = f1.rotateZ(tempAng);
            p2 = p2.rotateZ(tempAng);

            const f2x = (p2.x*p2.x - d2*d2 + d1*d1) / 2 / p2.x;
            let f2y = Math.sqrt(d1*d1 - f2x*f2x);

            if (transferAngle > Math.PI ? (f1.y < 0) : (f1.y > 0)) {
                f2y = -f2y;
            }

            e = -f1.sub_(new Vector([f2x, f2y, 0])).mag / 2 / sma;

            const p = sma * (1 - e*e);
            ta1 = Math.acos((p / r1 - 1) / e);
            const ta2 = Math.acos((p / r2 - 1) / e);

            if (ta1 > ta2 || ta2 - transferAngle < 0) {
                ta1 = -ta1;
            }
        }

        const perVector = (new Quaternion(normal, -ta1)).rotate(r1vec);
        let aop = nodeVector.angle(perVector);

        if (nodeVector.cross(perVector).angle(normal) > Math.PI / 2) {
            aop = 2 * Math.PI - aop;
        }

        return new KeplerianObject(e, sma, aop, inc, raan, ta1, startEpoch, mu, true);
    }

    static getTimeByY(y, A, B, E, r1, r2, d, alpha, mu) {
        const rm = (r2 + r1) / 2;
        const x0 = - rm / E;
        const y0 = B * Math.sqrt(x0*x0/A/A - 1);
        const x = A * Math.sqrt(1 + y*y/B/B);
        const a = (rm + E * x) / 2;
        const temp = Math.sqrt((x0 - x)*(x0 - x) + (y0 - y)*(y0 - y));
        const e = temp / 2 / a;
        const fx = (x0 - x) / temp;
        const fy = (y0 - y) / temp;
        const cosTa1 = -((x0 + d) * fx + y0 * fy) / r1;
        const sinTa1 = Math.sign(Math.sin(alpha)) * ((x0 + d) * fy - y0 * fx); // TODO optimize
        const ta1 = acosSigned(cosTa1, sinTa1);
        const n = Math.sqrt(mu/a/a/a);
        const E1 = this.getEccentricAnomalyByTrueAnomaly(ta1, e);
        let E2 = this.getEccentricAnomalyByTrueAnomaly(ta1 + alpha, e);
        if (ta1 + alpha > 2 * Math.PI) {
            E2 += 2 * Math.PI;
        }
        return (E2 - E1 - e * (Math.sin(E2) - Math.sin(E1))) / n;
    }

    static getEccentricAnomalyByTrueAnomaly(ta, ecc) {
        if (ecc < 1) {
            const cos = Math.cos(ta);
            return acosSigned(
                (ecc + cos) / (1 + ecc * cos),
                Math.sin(ta) // TODO optimize
            );
        } else {
            return 2 * Math.atanh(Math.tan(ta / 2) / Math.sqrt((ecc + 1) / (ecc - 1)));
        }
    }

}
