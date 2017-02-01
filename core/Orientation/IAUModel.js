class OrientationIAUModel extends OrientationAbstract
{
    constructor(rightAscensionCoefficients, declinationCoefficients, rotationCoefficients) {
        super();
        this.rightAscension = rightAscensionCoefficients;
        this.declination = declinationCoefficients;
        this.rotation = rotationCoefficients;

        this.ICRFQuaternion = new Quaternion([-1, 0, 0], deg2rad(23.4)); // needs refining
    }

    getQuaternionByEpoch(epoch) {
        const centuries = epoch / 3155760000;
        const days = epoch / 86400;

        const rightAscension = 90 + this.rightAscension[0] +
            centuries * this.rightAscension[1] +
            centuries * centuries * this.rightAscension[2];
        const declination = 90 - (this.declination[0] +
            centuries * this.declination[1] +
            centuries * centuries * this.declination[2]);
        const rotation = this.rotation[0] +
            days * this.rotation[1] +
            days * days * this.rotation[2];

        return Quaternion.mul(
            this.ICRFQuaternion,
            (new Quaternion())
                .setFromEuler(deg2rad(rightAscension), deg2rad(declination), deg2rad(rotation), 'ZXZ')
        );
    }
}