class ReferenceFrameFactory
{
    static create(starSystem, id, type, config) {
        let res = null;

        if (type == ReferenceFrame.INERTIAL_ECLIPTIC) {
            res = new ReferenceFrameInertial(
                new FunctionOfEpochObjectState(config.origin, RF_BASE),
                new Quaternion()
            );
        } else if (type == ReferenceFrame.INERTIAL_BODY_EQUATORIAL) {
            res = new ReferenceFrameInertialDynamic(
                new FunctionOfEpochObjectState(config.origin, RF_BASE),
                new FunctionOfEpochCustom((epoch) => {
                    const z = starSystem.getObject(config.origin).orientation.getQuaternionByEpoch(epoch).rotate_(new Vector([0, 0, 1]));
                    const equinox = z.cross(new Vector([0, 0, 1]));
                    return Quaternion.transfer(new Vector([0, 0, 1]), z).mul(
                        Quaternion.transfer(new Vector([1, 0, 0]), equinox)
                    );
                })
            );
        } else if (type == ReferenceFrame.INERTIAL_BODY_FIXED) {
            res = new ReferenceFrameBodyFixed(
                config.origin,
                true
            );
        } else if (type == ReferenceFrame.INERTIAL_TOPOCENTRIC) {
            res = new ReferenceFrameTopocentric(
                config.origin,
                config.lat,
                config.lon,
                config.height,
                true
            );
        } else if (type == ReferenceFrame.ICRF && EARTH !== undefined) {
            res = new ReferenceFrameInertial(
                new FunctionOfEpochObjectState(EARTH, RF_BASE),
                new Quaternion([-1, 0, 0], deg2rad(23.4))
            );
        } else if (type == ReferenceFrame.BODY_FIXED) {
            res = new ReferenceFrameBodyFixed(
                config.origin,
                false
            );
        } else if (type == ReferenceFrame.TOPOCENTRIC) {
            res = new ReferenceFrameTopocentric(
                config.origin,
                config.lat,
                config.lon,
                height,
                false
            );
        } else if (type == ReferenceFrame.BASE) {
            res = new ReferenceFrameBase();
        }

        return res ? res.setId(id).setStarSystem(starSystem) : null;
    }

    static createById(starSystem, id) {
        const type = Math.floor(id / 1000000);
        const origin = Math.floor((id % 1000000) / 1000);

        if ((type === ReferenceFrame.INERTIAL_ECLIPTIC)
            || (type === ReferenceFrame.INERTIAL_BODY_EQUATORIAL)
            || (type === ReferenceFrame.INERTIAL_BODY_FIXED)
            || (type === ReferenceFrame.ICRF)
            || (type === ReferenceFrame.BODY_FIXED)
        ) {
            return this.create(starSystem, id, type, {origin: origin});
        }

        return null;
    }
}

const RF_BASE = 1000000;

const ReferenceFrame = {
    BASE: 0,
    INERTIAL_ECLIPTIC: 1,
    INERTIAL_BODY_EQUATORIAL: 2,
    INERTIAL_BODY_FIXED: 3,
    INERTIAL_TOPOCENTRIC: 4,
    ICRF: 5,
    BODY_FIXED: 6,
    TOPOCENTRIC: 7,
};
