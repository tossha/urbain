class ReferenceFrame
{
    static getInertialEcliptic(origin) {
        if (origin === SOLAR_SYSTEM_BARYCENTER) {
            return RF_BASE;
        }

        const type = ReferenceFrame.INERTIAL_ECLIPTIC;
        const key = origin;

        if (!this.cache[type][key]) {
            this.cache[type][key] = new ReferenceFrameInertial(
                new FunctionOfEpochObjectState(origin, RF_BASE),
                IDENTITY_QUATERNION
            );
        }

        return this.cache[type][key];
    }

    static getInertialBodyEquatorial(origin) {
        const type = ReferenceFrame.INERTIAL_BODY_EQUATORIAL;
        const key = origin;

        if (!this.cache[type][key]) {
            this.cache[type][key] = new ReferenceFrameInertialDynamic(
                new FunctionOfEpochObjectState(origin, RF_BASE),
                new FunctionOfEpochCustom((epoch) => {
                    const z = BODIES[origin].orientation.getQuaternionByEpoch(epoch).rotate_(new Vector([0, 0, 1]));
                    const equinox = z.cross(new Vector([0, 0, 1]));
                    return Quaternion.transfer(new Vector([0, 0, 1]), z).mul(
                        Quaternion.transfer(new Vector([1, 0, 0]), equinox)
                    );
                })
            );
        }

        return this.cache[type][key];
    }

    static getInertialBodyFixed(origin) {
        const type = ReferenceFrame.INERTIAL_BODY_FIXED;
        const key = origin;

        if (!this.cache[type][key]) {
            this.cache[type][key] = new ReferenceFrameBodyFixed(
                origin,
                true
            );
        }

        return this.cache[type][key];
    }

    static getInertialTopocentric(origin, lat, lon, height) {
        const type = ReferenceFrame.INERTIAL_TOPOCENTRIC;
        const key = origin + '-' + lat + '-' + lon + '-' + height;

        if (!this.cache[type][key]) {
            this.cache[type][key] = new ReferenceFrameTopocentric(
                origin,
                lat,
                lon,
                height,
                true
            );
        }

        return this.cache[type][key];
    }

    static getICRF() {
        const type = ReferenceFrame.ICRF;
        const key = origin;

        if (!this.cache[type][key]) {
            this.cache[type][key] = new ReferenceFrameInertial(
                new FunctionOfEpochObjectState(EARTH, RF_BASE),
                new Quaternion([-1, 0, 0], deg2rad(23.4))
            );
        }

        return this.cache[type][key];
    }

    static getJ2000Equatorial() {
        return this.getICRF();
    }

    static getJ2000Ecliptic() {
        return RF_BASE;
    }

    static getBodyFixed(origin) {
        const type = ReferenceFrame.BODY_FIXED;
        const key = origin;

        if (!this.cache[type][key]) {
            this.cache[type][key] = new ReferenceFrameBodyFixed(
                origin,
                false
            );
        }

        return this.cache[type][key];
    }

    static getTopocentric(origin, lat, lon, height) {
        const type = ReferenceFrame.TOPOCENTRIC;
        const key = origin + '-' + lat + '-' + lon + '-' + height;

        if (!this.cache[type][key]) {
            this.cache[type][key] = new ReferenceFrameTopocentric(
                origin,
                lat,
                lon,
                height,
                false
            );
        }

        return this.cache[type][key];
    }
}

ReferenceFrame.INERTIAL_ECLIPTIC        = 1;
ReferenceFrame.INERTIAL_BODY_EQUATORIAL = 2;
ReferenceFrame.INERTIAL_BODY_FIXED      = 3;
ReferenceFrame.INERTIAL_TOPOCENTRIC     = 4;
ReferenceFrame.ICRF                     = 5;
ReferenceFrame.J2000_EQUATORIAL         = 6; // ICRF
ReferenceFrame.J2000_ECLIPTIC           = 7; // RF_BASE
ReferenceFrame.BODY_FIXED               = 8;
ReferenceFrame.TOPOCENTRIC              = 9;

ReferenceFrame.cache = {
    [ReferenceFrame.INERTIAL_ECLIPTIC       ]: {},
    [ReferenceFrame.INERTIAL_BODY_EQUATORIAL]: {},
    [ReferenceFrame.INERTIAL_BODY_FIXED     ]: {},
    [ReferenceFrame.INERTIAL_TOPOCENTRIC    ]: {},
    [ReferenceFrame.ICRF                    ]: {},
    [ReferenceFrame.J2000_EQUATORIAL        ]: {},
    [ReferenceFrame.J2000_ECLIPTIC          ]: {},
    [ReferenceFrame.BODY_FIXED              ]: {},
    [ReferenceFrame.TOPOCENTRIC             ]: {},
};