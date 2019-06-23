import {ReferenceFrame} from "../../../core/ReferenceFrame/Factory";
import ReferenceFrameFactory from "../../../core/ReferenceFrame/Factory";
import TrajectoryKeplerianAbstract from "../../../core/Trajectory/KeplerianAbstract";
import KeplerianObject from "../../../core/KeplerianObject";
import {Vector} from "../../../core/algebra";
import StateVector from "../../../core/StateVector";
import ModuleSolarSystem from "../ModuleSolarSystem";
import { sim } from "../../../core/simulation-engine";

export default class TrajectoryVSOP87 extends TrajectoryKeplerianAbstract
{
    constructor(config) {
        super(ReferenceFrameFactory.buildId((config.body === ModuleSolarSystem.SUN) ? 0 : ModuleSolarSystem.SUN, ReferenceFrame.INERTIAL_ECLIPTIC));
        this.coefficients = config.coefficients;
        this.mu = (config.body === ModuleSolarSystem.SUN)
            ? 319.77790837966666
            : sim.starSystem.getObject(ModuleSolarSystem.SUN).physicalModel.mu;
    }

    getKeplerianObjectByEpoch(epoch, referenceFrameOrId) {
        return KeplerianObject.createFromState(
            this.referenceFrame.transformStateVectorByEpoch(
                epoch,
                this.getStateInOwnFrameByEpoch(epoch),
                referenceFrameOrId === undefined
                    ? this.referenceFrame
                    : referenceFrameOrId
            ),
            this.mu,
            epoch
        );
    }

    getStateInOwnFrameByEpoch(epoch) {
        const T = epoch / 86400 / 365250;
        let position = new Vector(3);
        let velocity = new Vector(3);

        for (let varNum in this.coefficients) {
            varNum = 0|varNum;
            for (let degree in this.coefficients[varNum]) {
                degree = 0|degree;
                let posSum = 0;
                let diffSum = 0;
                const tPowDegree = Math.pow(T, degree);
                for (let coeffs of this.coefficients[varNum][degree]) {
                    posSum += coeffs[0] * Math.cos(coeffs[1] + coeffs[2] * T);
                    diffSum += coeffs[0] * coeffs[2] * Math.sin(coeffs[1] + coeffs[2] * T)
                }
                position[varNum] += tPowDegree * posSum;
                velocity[varNum] += (degree ? degree * Math.pow(T, degree - 1) * posSum : 0) - tPowDegree * diffSum;
            }
        }

        return new StateVector(position.mul_(149597870.7), velocity.mul_(149597870.7 / 86400 / 365250));
    }
}
