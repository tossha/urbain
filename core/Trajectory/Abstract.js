class TrajectoryAbstract
{
    constructor(referenceFrame) {
        let that = this;

        this.cachedEpoch = null;
        this.cachedState = null;

        this.referenceFrame = referenceFrame || null; // class ReferenceFrameAbstract
        document.addEventListener('vr_render', function (event) {
            that.render(event.detail.epoch);
        });
    }

    drop() {
        if (this.visualModel) {
            this.visualModel.drop();
        }
    }

    setId(id) {
        this.id = id;
    }

    set isSelected(newValue) {
        if (this.visualModel) {
            this.visualModel.isSelected = newValue;
        }
    }

    getStateInOwnFrameByEpoch(epoch) {
        return ZERO_STATE_VECTOR;
    }

    getStateByEpoch(epoch, referenceFrame) {
        let state;
        if (referenceFrame === RF_BASE && epoch === this.cachedEpoch) {
            state = this.cachedState;
        } else {
            state = this.getStateInOwnFrameByEpoch(epoch);
            if (referenceFrame === RF_BASE && epoch === time.epoch) {
                this.cachedState = state;
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

    render(epoch) {
        if (this.visualModel) {
            this.visualModel.render(epoch);
        }
    }
}