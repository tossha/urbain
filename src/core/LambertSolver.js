import {getAngleBySinCos, Vector, Quaternion, newtonSolve} from "../algebra";
import KeplerianObject from "./KeplerianObject";
import VisualVector from "../visual/Vector";
import {SUN} from "../solar_system";

export default class LambertSolver
{
    static getPlotData(orbit1, orbit2, epoch1Min, epoch1Max, transferMin, transferMax, points) {
        const epoch1Step = (epoch1Max - epoch1Min) / (points - 1);
        const epoch2Step = (transferMax - transferMin) / (points - 1);
        let result = [];
        let epoch1 = epoch1Min;
        let i = 0;

        while (epoch1 < epoch1Max) {
            let epoch2 = epoch1 + transferMin;
            let j = 0;

            result[i] = [];
            while (epoch2 < epoch1 + transferMax) {
                let res = this.calcDeltaV(orbit1, orbit2, epoch1, epoch2);
                result[i][j] = res ? res.toPrecision(4) : '-----';
                epoch2 += epoch2Step;
                j++;
            }
            epoch1 += epoch1Step;
            i++;
        }
        return result;
    }

    static getDeltaV(orbit1, orbit2, transferOrbit, epoch1, epoch2) {
        return orbit1.getStateByEpoch(epoch1).velocity.sub(transferOrbit.getStateByEpoch(epoch1).velocity).mag +
            orbit2.getStateByEpoch(epoch2).velocity.sub(transferOrbit.getStateByEpoch(epoch2).velocity).mag;

    }

    static calcDeltaV(orbit1, orbit2, epoch1, epoch2) {
        const transferOrbit = this.solve(orbit1, orbit2, epoch1, epoch2);

        if (!transferOrbit) {
            return false;
        }

        return this.getDeltaV(orbit1, orbit2, transferOrbit, epoch1, epoch2);
    }

    static addVisHelper(vector, epoch) {
        this.visHelpers = this.visHelpers || [];
        this.visHelpers.push(new VisualVector(vector, sim.starSystem.getObject(SUN).getPositionByEpoch(epoch)));
        sim.renderer.render(sim.scene, sim.camera.threeCamera);
    }

    static clearHelpers() {
        if (this.visHelpers) {
            for (let i in this.visHelpers) {
                this.visHelpers[i].drop();
            }
        }
        this.visHelpers = [];
        sim.renderer.render(sim.scene, sim.camera.threeCamera);
    }

    static solve(orbit1, orbit2, epoch1, epoch2) {
        const maxError = 1;
        const maxSteps = 15;

        const r1vec = orbit1.getStateByEpoch(epoch1).position;
        const r2vec = orbit2.getStateByEpoch(epoch2).position;
        let normal = r1vec.cross(r2vec);
        const r1 = r1vec.mag;
        const r2 = r2vec.mag;
        let transferAngle = r1vec.angle(r2vec);

        this.clearHelpers();

        this.addVisHelper(r1vec, epoch1);
        this.addVisHelper(r2vec, epoch2);

        if (normal.angle(orbit1.getNormalVector()) > Math.PI / 2) {
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

        const target = epoch2 - epoch1;
        const parabolicTime = (Math.pow(r1+r2+2*d, 3/2) - signSinTransferAngle*Math.pow(r1+r2-2*d, 3/2)) / (6 * Math.sqrt(orbit1.mu));

        if (target > parabolicTime) {
            // ellipse
            const A = (r2 - r1) / 2;
            const E = d / A;
            const B = Math.sqrt(d*d - A*A);
            let y = newtonSolve(
                (yParam) => this.getTimeByY(yParam, A, B, E, r1, r2, d, transferAngle, orbit1.mu) - target,
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
                    return Math.sqrt(Math.abs(Math.pow(a, 3)) / orbit1.mu) *
                        (Math.sinh(alpha) - alpha - signSinTransferAngle * (Math.sinh(beta) - beta)) - target;
                },
                orbit1.sma, 10, maxError, maxSteps
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


        return new KeplerianObject(e, sma, aop, inc, raan, ta1, epoch1, orbit1.mu, true);
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