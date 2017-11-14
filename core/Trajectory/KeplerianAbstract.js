class TrajectoryKeplerianAbstract extends TrajectoryAbstract
{
    getKeplerianObjectByEpoch(epoch) {}

    constructor(referenceFrame, color) {
        super(referenceFrame);

        let that = this;
        this.orbitalReferenceFrame = new ReferenceFrameInertialDynamic(
            new FunctionOfEpochCustom((epoch) => {
                return that.referenceFrame.getOriginStateByEpoch(epoch);
            }),
            new FunctionOfEpochCustom((epoch) => {
                return that.referenceFrame.getQuaternionByEpoch(epoch).mul(
                    that.getKeplerianObjectByEpoch(epoch).getOrbitalFrameQuaternion()
                );
            })
        );

        if (color) {
            this.visualModel = new VisualTrajectoryModelKeplerian(this, color);
        }
    }

    getPeriapsisVector(epoch) {
        return this.getKeplerianObjectByEpoch(epoch).getPeriapsisVector();
    }

    isEditable() {
        return false;
    }

    getStateInOwnFrameByEpoch(epoch) {
        return this.getKeplerianObjectByEpoch(epoch).getStateByEpoch(epoch);
    }
}