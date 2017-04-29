class TrajectoryKeplerianAbstract extends TrajectoryAbstract
{
    getKeplerianObjectByEpoch(epoch) {}

    constructor(referenceFrame, color) {
        super(referenceFrame);

        if (color) {
            this.visualModel = new VisualTrajectoryModelKeplerian(this, color);
        }
    }

    isEditable() {
        return false;
    }

    getStateInOwnFrameByEpoch(epoch) {
        return this.getKeplerianObjectByEpoch(epoch).getStateByEpoch(epoch);
    }
}