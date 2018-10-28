import { RF_BASE } from "./ReferenceFrame/Factory";

export default class EphemerisObject
{
    constructor(bodyId, type, name, data) {
        this.id   = bodyId;
        this.type = type;
        this.name = name;
        this.data = data || {};
    }

    setTrajectory(trajectory) {
        this.trajectory = trajectory;
        this.trajectory.setObject(this);
    }

    getParentObjectIdByEpoch(epoch) {
        if (!this.trajectory) {
            return null;
        }

        const rf = this.trajectory.getReferenceFrameByEpoch(epoch);
        if (!rf) {
            return null;
        }

        return rf.originId;
    }

    getStateByEpoch(epoch, referenceFrame) {
        return this.trajectory.getStateByEpoch(epoch, referenceFrame || RF_BASE);
    }

    getPositionByEpoch(epoch, referenceFrame) {
        return this.trajectory.getPositionByEpoch(epoch, referenceFrame || RF_BASE);
    }

    select() {
        this.trajectory && this.trajectory.select();
    }

    deselect() {
        this.trajectory && this.trajectory.deselect();
    }

    drop() {
        if (this.trajectory) {
            this.trajectory.drop();
            delete this.trajectory;
        }
    }
}

EphemerisObject.TYPE_UNKNOWN    = 0;
EphemerisObject.TYPE_STAR       = 1;
EphemerisObject.TYPE_PLANET     = 2;
EphemerisObject.TYPE_PLANETOID  = 3;
EphemerisObject.TYPE_SATELLITE  = 4;
EphemerisObject.TYPE_ASTEROID   = 5;
EphemerisObject.TYPE_COMET      = 6;
EphemerisObject.TYPE_SPACECRAFT = 7;
EphemerisObject.TYPE_POINT      = 8;
