import OrientationAbstract from "../../../../../core/Orientation/Abstract";
import { deg2rad, Quaternion } from "../../../../../core/algebra";
import { SECONDS_PER_DAY, SECONDS_PER_YEAR } from "../../../../../constants/dates";

export default class OrientationIAUModel extends OrientationAbstract {
    constructor(config) {
        super();
        this.rightAscension = config[0];
        this.declination = config[1];
        this.rotation = config[2];

        this.ICRFQuaternion = new Quaternion([-1, 0, 0], deg2rad(23.4)); // TODO needs refining
    }

    getQuaternionByEpoch(epoch) {
        const centuries = (epoch / SECONDS_PER_YEAR) * 100;
        const days = epoch / SECONDS_PER_DAY;

        const rightAscension =
            90 +
            this.rightAscension[0] +
            centuries * this.rightAscension[1] +
            centuries * centuries * this.rightAscension[2];
        const declination =
            90 - (this.declination[0] + centuries * this.declination[1] + centuries * centuries * this.declination[2]);
        const rotation = this.rotation[0] + days * this.rotation[1] + days * days * this.rotation[2];

        return this.ICRFQuaternion.mul(
            new Quaternion().setFromEuler(deg2rad(rightAscension), deg2rad(declination), deg2rad(rotation), "ZXZ"),
        );
    }
}
