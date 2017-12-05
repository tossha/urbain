
import TrajectoryAbstract from "./Abstract";
import {RF_BASE} from "../ReferenceFrame/Factory";

export default class TrajectoryComposite extends TrajectoryAbstract
{
    constructor() {
        super(RF_BASE);
        this.components = [];
        this.lastUsedTrajectory = null;
    }

    addComponent(trajectory) {
        this.components.push(trajectory);
        if (this.minEpoch === null
            || (trajectory.minEpoch !== null
                && trajectory.minEpoch !== false
                && this.minEpoch > trajectory.minEpoch
            )
        ) {
            this.minEpoch = trajectory.minEpoch;
        }
        if (this.maxEpoch === null
            || (trajectory.maxEpoch !== null
                && trajectory.maxEpoch !== false
                && this.maxEpoch < trajectory.maxEpoch
            )
        ) {
            this.maxEpoch = trajectory.maxEpoch;
        }
    }

    getStateInOwnFrameByEpoch(epoch) {
        return this._getTrajectoryByEpoch(epoch).getStateInOwnFrameByEpoch(epoch);
    }

    getStateByEpoch(epoch, referenceFrame) {
        return this._getTrajectoryByEpoch(epoch).getStateByEpoch(epoch, referenceFrame);
    }

    _getTrajectoryByEpoch(epoch) {
        if (this.lastUsedTrajectory
            && (this.lastUsedTrajectory.minEpoch < epoch || this.lastUsedTrajectory.minEpoch === false)
            && (this.lastUsedTrajectory.maxEpoch > epoch || this.lastUsedTrajectory.maxEpoch === false)
        ) {
            return this.lastUsedTrajectory;
        }

        for (let trajectory of this.components) {
            if ((trajectory.minEpoch < epoch || trajectory.minEpoch === false)
                && (trajectory.maxEpoch > epoch || trajectory.maxEpoch === false)
            ) {
                this.lastUsedTrajectory = trajectory;
                return trajectory;
            }
        }

        return false;
    }
}