class TrajectoryAbstract
{
    constructor(referenceFrame) {
        let that = this;

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

    set isSelected(newValue) {
        if (this.visualModel) {
            this.visualModel.isSelected = newValue;
        }
    }

    getStateInOwnFrameByEpoch(epoch) {
        return ZERO_STATE_VECTOR;
    }

    getStateByEpoch(epoch, referenceFrame) {
        let state = this.getStateInOwnFrameByEpoch(epoch);
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