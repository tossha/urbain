class EphemerisObject
{
    constructor(bodyId, name, trajectory) {
        this.id            = bodyId;
        this.name          = name;
        this.trajectory    = trajectory;     // class TrajectoryAbstract

        this.trajectory.setObject(this);
    }

    getPositionByEpoch(epoch, referenceFrame) {
        return this.trajectory.getPositionByEpoch(epoch, referenceFrame ? referenceFrame : RF_BASE);
    }
}