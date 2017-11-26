class TrajectoryAbstract
{
    constructor(starSystem, referenceFrameId) {
        this.minEpoch = null;
        this.maxEpoch = null;

        this.cachedEpoch = null;
        this.cachedState = null;

        this.visualModel = null;
        this.object = null;

        this.starSystem = starSystem;
        this.referenceFrameId = referenceFrameId;
        this.referenceFrame = starSystem.getReferenceFrame(referenceFrameId);
    }

    setObject(object) {
        this.object = object;
    }

    drop() {
        if (this.visualModel) {
            this.visualModel.drop();
        }
    }

    set isSelected(newValue) {
        if (this.visualModel) {
            this.visualModel.isSelected = newValue;
        }
    }

    getStateInOwnFrameByEpoch(epoch) {
        return new StateVector();
    }

    getStateByEpoch(epoch, referenceFrame) {
        let state;
        if (referenceFrame === RF_BASE && epoch === this.cachedEpoch) {
            state = this.cachedState;
        } else {
            state = this.getStateInOwnFrameByEpoch(epoch);
            if (referenceFrame === RF_BASE && epoch === time.epoch) {
                this.cachedState = state;
                this.cachedEpoch = epoch;
            }
        }

        return this.referenceFrame.transformStateVectorByEpoch(epoch, state, referenceFrame);
    }

    getPositionByEpoch(epoch, referenceFrame) {
        return this.getStateByEpoch(epoch, referenceFrame).position;
    }

    getVelocityByEpoch(epoch, referenceFrame) {
        return this.getStateByEpoch(epoch, referenceFrame).velocity;
    }
}