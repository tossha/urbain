import FunctionOfEpochObjectState from "../FunctionOfEpoch/ObjectState";
import {deg2rad, Quaternion, Vector} from "../../algebra";
import FunctionOfEpochCustom from "../FunctionOfEpoch/Custom";
import ReferenceFrameBodyFixed from "./BodyFixed";
import {EARTH} from "../../solar_system";
import ReferenceFrameBase from "./Base";
import ReferenceFrameInertial from "./Inertial";
import ReferenceFrameInertialDynamic from "./InertialDynamic";
import Body from "../Body";
import ReferenceFrameTopocentric from "./Topocentric";

export default class ReferenceFrameFactory
{
    static create(id, type, config) {
        let res = null;

        if (type == ReferenceFrame.INERTIAL_ECLIPTIC) {
            res = new ReferenceFrameInertial(
                new FunctionOfEpochObjectState(config.origin, RF_BASE),
                new Quaternion()
            );
        } else if (type == ReferenceFrame.INERTIAL_BODY_EQUATORIAL) {
            if (sim.starSystem.getObject(config.origin) instanceof Body) {
                res = new ReferenceFrameInertialDynamic(
                    new FunctionOfEpochObjectState(config.origin, RF_BASE),
                    new FunctionOfEpochCustom((epoch) => {
                        const z = sim.starSystem.getObject(config.origin).orientation.getQuaternionByEpoch(epoch).rotate_(new Vector([0, 0, 1]));
                        const equinox = z.cross(new Vector([0, 0, 1]));
                        return Quaternion.transfer(new Vector([0, 0, 1]), z).mul(
                            Quaternion.transfer(new Vector([1, 0, 0]), equinox)
                        );
                    })
                );
            } else {
                res = null;
            }
        } else if (type == ReferenceFrame.INERTIAL_PARENT_BODY_EQUATORIAL) {
            res = new ReferenceFrameInertialDynamic(
                new FunctionOfEpochObjectState(config.origin, RF_BASE),
                new FunctionOfEpochCustom((epoch) => {
                    const parentId = sim.starSystem.getObject(config.origin).getParentObjectIdByEpoch(epoch);
                    const parent = sim.starSystem.getObject(parentId);

                    if (parent instanceof Body) {
                        const z = parent.orientation.getQuaternionByEpoch(epoch).rotate_(new Vector([0, 0, 1]));
                        const equinox = z.cross(new Vector([0, 0, 1]));
                        return Quaternion.transfer(new Vector([0, 0, 1]), z).mul(
                            Quaternion.transfer(new Vector([1, 0, 0]), equinox)
                        );
                    } else {
                        return new Quaternion();
                    }
                })
            );
        } else if (type == ReferenceFrame.INERTIAL_BODY_FIXED) {
            if (sim.starSystem.getObject(config.origin) instanceof Body) {
                res = new ReferenceFrameBodyFixed(
                    config.origin,
                    true
                );
            } else {
                res = null;
            }
        } else if (type == ReferenceFrame.INERTIAL_TOPOCENTRIC) {
            if (sim.starSystem.getObject(config.origin) instanceof Body) {
                res = new ReferenceFrameTopocentric(
                    config.origin,
                    config.lat,
                    config.lon,
                    config.height,
                    true
                );
            } else {
                res = null;
            }
        } else if (type == ReferenceFrame.ICRF && EARTH !== undefined) {
            res = new ReferenceFrameInertial(
                new FunctionOfEpochObjectState(EARTH, RF_BASE),
                new Quaternion([-1, 0, 0], deg2rad(23.4))
            );
        } else if (type == ReferenceFrame.BODY_FIXED) {
            if (sim.starSystem.getObject(config.origin) instanceof Body) {
                res = new ReferenceFrameBodyFixed(
                    config.origin,
                    false
                );
            } else {
                res = null;
            }
        } else if (type == ReferenceFrame.TOPOCENTRIC) {
            if (sim.starSystem.getObject(config.origin) instanceof Body) {
                res = new ReferenceFrameTopocentric(
                    config.origin,
                    config.lat,
                    config.lon,
                    height,
                    false
                );
            } else {
                res = null;
            }
        } else if (type == ReferenceFrame.BASE) {
            res = new ReferenceFrameBase();
        }

        return res ? res.setId(id) : null;
    }

    static getOriginIdByReferenceFrameId(referenceFrameId) {
        return Math.sign(referenceFrameId) * Math.floor(Math.abs(referenceFrameId) / 100000);
    }

    static getTypeByReferenceFrameId(referenceFrameId) {
        return Math.floor((Math.abs(referenceFrameId) % 100000) / 1000);
    }

    static createById(id) {
        const type = this.getTypeByReferenceFrameId(id);

        if ((type === ReferenceFrame.INERTIAL_ECLIPTIC)
            || (type === ReferenceFrame.INERTIAL_BODY_EQUATORIAL)
            || (type === ReferenceFrame.INERTIAL_BODY_FIXED)
            || (type === ReferenceFrame.ICRF)
            || (type === ReferenceFrame.BODY_FIXED)
            || (type === ReferenceFrame.INERTIAL_PARENT_BODY_EQUATORIAL)
        ) {
            return this.create(id, type, {origin: this.getOriginIdByReferenceFrameId(id)});
        }

        return null;
    }

    static buildId(origin, type) {
        if ((type === ReferenceFrame.INERTIAL_ECLIPTIC)
            || (type === ReferenceFrame.INERTIAL_BODY_EQUATORIAL)
            || (type === ReferenceFrame.INERTIAL_BODY_FIXED)
            || (type === ReferenceFrame.ICRF)
            || (type === ReferenceFrame.BODY_FIXED)
            || (type === ReferenceFrame.INERTIAL_PARENT_BODY_EQUATORIAL)
        ) {
            return Math.sign(origin) * (Math.abs(origin) * 100000 + type * 1000);
        }

        return null;
    }
}

export const RF_BASE = 1000;

export const ReferenceFrame = {
    BASE: 0,
    INERTIAL_ECLIPTIC: 1,
    INERTIAL_BODY_EQUATORIAL: 2,
    INERTIAL_BODY_FIXED: 3,
    INERTIAL_TOPOCENTRIC: 4,
    ICRF: 5,
    BODY_FIXED: 6,
    TOPOCENTRIC: 7,
    INERTIAL_PARENT_BODY_EQUATORIAL: 8,
};
