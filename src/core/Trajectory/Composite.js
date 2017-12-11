
import TrajectoryAbstract from "./Abstract";
import {RF_BASE} from "../ReferenceFrame/Factory";
import TimeLine from "../TimeLine";

export default class TrajectoryComposite extends TrajectoryAbstract
{
    constructor() {
        super(RF_BASE);
        this.components = [];
        this.lastUsedTrajectory = null;
    }

    getReferenceFrameByEpoch(epoch) {
        const traj = this._getTrajectoryByEpoch(epoch);
        if (!traj) {
            return null;
        }
        return traj.getReferenceFrameByEpoch(epoch);
    }

    getKeplerianObjectByEpoch(epoch) {
        const traj = this._getTrajectoryByEpoch(epoch);
        if (!traj) {
            return null;
        }
        return traj.getKeplerianObjectByEpoch(epoch);
    }

    addComponent(trajectory) {
        this.components.push(trajectory);
        trajectory.setParent(this);

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

    select() {
        super.select();
        this.components.map(traj => traj.select());
    }

    deselect() {
        super.deselect();
        this.components.map(traj => traj.deselect());
    }

    getStateInOwnFrameByEpoch(epoch) {
        return this._getTrajectoryByEpoch(epoch).getStateInOwnFrameByEpoch(epoch);
    }

    getStateByEpoch(epoch, referenceFrame) {
        return this._getTrajectoryByEpoch(epoch).getStateByEpoch(epoch, referenceFrame);
    }

    _getTrajectoryByEpoch(epoch) {
        if (this.lastUsedTrajectory
            && (this.lastUsedTrajectory.minEpoch <= epoch || this.lastUsedTrajectory.minEpoch === false)
            && (this.lastUsedTrajectory.maxEpoch >= epoch || this.lastUsedTrajectory.maxEpoch === false)
        ) {
            return this.lastUsedTrajectory;
        }

        for (let trajectory of this.components) {
            if ((trajectory.minEpoch <= epoch || trajectory.minEpoch === false)
                && (trajectory.maxEpoch >= epoch || trajectory.maxEpoch === false)
            ) {
                this.lastUsedTrajectory = trajectory;
                return trajectory;
            }
        }

        console.log('Insufficient ephemeris data has been loaded to compute the state of ' +
            (this.object && this.object.id) + ' (' + (this.object && this.object.name) + ') at the ephemeris epoch ' +
            epoch + ' (' + TimeLine.getDateByEpoch(epoch) + ').'
        );

        return null;
    }
}