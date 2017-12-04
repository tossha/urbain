class EphemerisObject
{
    constructor(bodyId, name) {
        this.id   = bodyId;
        this.name = name;
    }

    setTrajectory(trajectory) {
        this.trajectory = trajectory;     // class TrajectoryAbstract
        this.trajectory.setObject(this);
    }

    getPositionByEpoch(epoch, referenceFrame) {
        return this.trajectory.getPositionByEpoch(epoch, referenceFrame ? referenceFrame : RF_BASE);
    }
}