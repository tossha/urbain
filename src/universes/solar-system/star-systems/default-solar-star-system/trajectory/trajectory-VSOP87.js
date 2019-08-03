import { ReferenceFrame } from "../../../../../core/ReferenceFrame/Factory";
import ReferenceFrameFactory from "../../../../../core/ReferenceFrame/Factory";
import TrajectoryKeplerianAbstract from "../../../../../core/Trajectory/KeplerianAbstract";
import KeplerianObject from "../../../../../core/KeplerianObject";
import { Vector } from "../../../../../core/algebra";
import StateVector from "../../../../../core/StateVector";
import { sim } from "../../../../../core/simulation-engine";
import { SECONDS_PER_DAY } from "../../../../../constants/dates";
import { SUN } from "../constants";

export default class TrajectoryVSOP87 extends TrajectoryKeplerianAbstract {
    constructor(config) {
        super(ReferenceFrameFactory.buildId(config.body === SUN ? 0 : SUN, ReferenceFrame.INERTIAL_ECLIPTIC));
        this.coefficients = config.coefficients;
        this.mu = config.body === SUN ? 319.77790837966666 : sim.starSystem.getObject(SUN).physicalModel.mu;
    }

    getKeplerianObjectByEpoch(epoch, referenceFrameOrId) {
        return KeplerianObject.createFromState(
            this.referenceFrame.transformStateVectorByEpoch(
                epoch,
                this.getStateInOwnFrameByEpoch(epoch),
                referenceFrameOrId === undefined ? this.referenceFrame : referenceFrameOrId,
            ),
            this.mu,
            epoch,
        );
    }

    getStateInOwnFrameByEpoch(epoch) {
        const T = epoch / SECONDS_PER_DAY / 365250;
        let position = new Vector(3);
        let velocity = new Vector(3);

        for (let varNum in this.coefficients) {
            varNum = 0 | varNum;
            for (let degree in this.coefficients[varNum]) {
                degree = 0 | degree;
                let posSum = 0;
                let diffSum = 0;
                const tPowDegree = Math.pow(T, degree);
                for (let coeffs of this.coefficients[varNum][degree]) {
                    posSum += coeffs[0] * Math.cos(coeffs[1] + coeffs[2] * T);
                    diffSum += coeffs[0] * coeffs[2] * Math.sin(coeffs[1] + coeffs[2] * T);
                }
                position[varNum] += tPowDegree * posSum;
                velocity[varNum] += (degree ? degree * Math.pow(T, degree - 1) * posSum : 0) - tPowDegree * diffSum;
            }
        }

        return new StateVector(position.mul_(149597870.7), velocity.mul_(149597870.7 / SECONDS_PER_DAY / 365250));
    }
}
