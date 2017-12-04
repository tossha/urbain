class TrajectoryAbstract
{
    constructor(referenceFrameId) {
        this.minEpoch = null;
        this.maxEpoch = null;

        this.cachedEpoch = null;
        this.cachedState = null;

        this.visualModel = null;
        this.object = null;

        this.referenceFrameId = referenceFrameId;
        this.referenceFrame = sim.starSystem.getReferenceFrame(referenceFrameId);
    }

    setObject(object) {
        this.object = object;
    }

    drop() {
        if (this.visualModel) {
            this.visualModel.drop();
        }
    }

    select() {
        this.visualModel && this.visualModel.select();
    }

    deselect() {
        this.visualModel && this.visualModel.deselect();
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
            if (referenceFrame === RF_BASE && epoch === sim.currentEpoch) {
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