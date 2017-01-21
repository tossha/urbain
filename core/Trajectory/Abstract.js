class TrajectoryAbstract
{
    constructor(referenceFrame) {
        this.referenceFrame = referenceFrame || null; // class ReferenceFrame
    }

    drop() {
        if (this.visualModel) {
            this.visualModel.drop();
        }

        for (let trajIdx in TRAJECTORIES) {
            if (this === TRAJECTORIES[trajIdx]) {
                delete TRAJECTORIES[trajIdx];
                break;
            }
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