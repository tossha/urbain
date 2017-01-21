class Body
{
    constructor(visualModel, physicalModel, trajectory, orientation) {
        this.visualModel   = visualModel;    // class VisualBodyModelBasic
        this.physicalModel = physicalModel;  // class PhysicalBodyModel
        this.trajectory    = trajectory;     // class TrajectoryAbstract
        this.orientation   = orientation;
        this.visualModel.body = this;
    }

    getPositionByEpoch(epoch, referenceFrame) {
        return this.trajectory.getPositionByEpoch(epoch, referenceFrame);
    }

    render(epoch) {
        return this.visualModel.render(
            epoch,
            this.getPositionByEpoch(epoch, RF_BASE)
        );
    }
}