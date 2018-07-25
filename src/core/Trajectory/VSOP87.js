import {ReferenceFrame} from "../ReferenceFrame/Factory";
import {SUN} from "../../interface/solar_system";
import ReferenceFrameFactory from "../ReferenceFrame/Factory";
import TrajectoryKeplerianAbstract from "./KeplerianAbstract";
import KeplerianObject from "../KeplerianObject";
import {Vector} from "../algebra";
import StateVector from "../StateVector";
import { sim } from "../Simulation";

export default class TrajectoryVSOP87 extends TrajectoryKeplerianAbstract
{
    constructor(body, coefficients) {
        super(ReferenceFrameFactory.buildId((body == SUN) ? 0 : SUN, ReferenceFrame.INERTIAL_ECLIPTIC));
        this.coefficients = coefficients;
        this.mu = (body == SUN)
            ? 319.77790837966666
            : sim.starSystem.getObject(SUN).physicalModel.mu;
    }

    getKeplerianObjectByEpoch(epoch) {
        return KeplerianObject.createFromState(this.getStateInOwnFrameByEpoch(epoch), this.mu, epoch);
    }

    getStateInOwnFrameByEpoch(epoch) {
        const T = epoch / 86400 / 365250;
        let position = new Vector(3);
        let velocity = new Vector(3);

        for (let varNum in this.coefficients) {
            for (let degree in this.coefficients[varNum]) {
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
