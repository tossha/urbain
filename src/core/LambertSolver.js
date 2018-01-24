import {getAngleBySinCos, Vector, Quaternion, newtonSolve} from "../algebra";
import KeplerianObject from "./KeplerianObject";
import VisualVector from "../visual/Vector";
import {SUN} from "../solar_system";

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

            if (y === false) {
                return false;
            }

            const x0 = -(r2 + r1) / 2 / E;
            const y0 = B * Math.sqrt(x0 * x0 / A / A - 1);
            const x = A * Math.sqrt(1 + y * y / B / B);
            const temp = Math.sqrt((x0 - x) * (x0 - x) + (y0 - y) * (y0 - y));
            const fx = (x0 - x) / temp;
            const fy = (y0 - y) / temp;
            ta1 = getAngleBySinCos(
                signSinTransferAngle * ((x0 + d) * fy - y0 * fx) / r1,
                -((x0 + d) * fx + y0 * fy) / r1
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
        const sinTa1 = Math.sign(Math.sin(alpha)) * ((x0 + d) * fy - y0 * fx) / r1;
        const ta1 = getAngleBySinCos(sinTa1, cosTa1);
        const n = Math.sqrt(mu/a/a/a);
        const E1 = this.getEccentricAnomalyByTrueAnomaly(ta1, e);
        let E2 = this.getEccentricAnomalyByTrueAnomaly(ta1 + alpha, e);
        if (ta1 + alpha > 2 * Math.PI) {
            E2 += 2 * Math.PI;
        }
        return (E2 - E1 - e * (Math.sin(E2) - Math.sin(E1))) / n;
    }

    static getEccentricAnomalyByTrueAnomaly(ta, ecc) {
        const cos = Math.cos(ta);
        return getAngleBySinCos(
            Math.sqrt(1 - ecc * ecc) * Math.sin(ta) / (1 + ecc * cos),
            (ecc + cos) / (1 + ecc * cos)
        );
    }

}