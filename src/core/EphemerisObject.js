import {RF_BASE} from "./ReferenceFrame/Factory";

export default class EphemerisObject
{
    constructor(bodyId, name) {
        this.id   = bodyId;
        this.name = name;
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

        return sim.starSystem.getReferenceFrameIdObject(rf.id);
    }

    getPositionByEpoch(epoch, referenceFrame) {
        return this.trajectory.getPositionByEpoch(epoch, referenceFrame || RF_BASE);
    }
}