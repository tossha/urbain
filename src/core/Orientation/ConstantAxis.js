import OrientationAbstract from "./Abstract";
import {Quaternion, Vector} from "../algebra";

export default class OrientationConstantAxis extends OrientationAbstract
{
    constructor(config) {
        super();
        const angularVelocity = new Vector(config.vector);
        this.axisQuaternion = Quaternion.transfer(new Vector([0, 0, 1]), angularVelocity);
        this.angularSpeed = angularVelocity.mag;
        this.initialAngle = config.angle || 0;
        this.initialEpoch = config.epoch || 0;
    }

    getQuaternionByEpoch(epoch) {
        return this.axisQuaternion.mul(
            new Quaternion(
                [0, 0, 1],
                this.initialAngle + (epoch - this.initialEpoch) * this.angularSpeed
            )
        );
    }
}
