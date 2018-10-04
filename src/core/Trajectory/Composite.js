import TrajectoryAbstract from "./Abstract";
import ExceptionOutOfRange from "./ExceptionOutOfRange";

export default class TrajectoryComposite extends TrajectoryAbstract
{
    constructor() {
        super();
        this.components = [];
        this.lastUsedTrajectory = null;
        this.isSelected = false;
    }

    select() {
        this.isSelected = true;
        this.visualModel && this.visualModel.select();
        this.components.map(traj => traj.select());
    }

    deselect() {
        super.deselect();
        this.components.map(traj => traj.deselect());
    }

    drop() {
        this.components.map(traj => traj.drop());
    }

    isEditableAtEpoch(epoch) {
        return this.getComponentByEpoch(epoch).isEditableAtEpoch(epoch);
    }

    getReferenceFrameByEpoch(epoch) {
        return this.getComponentByEpoch(epoch).getReferenceFrameByEpoch(epoch);
    }

    getStateInOwnFrameByEpoch(epoch) {
        return this.getComponentByEpoch(epoch).getStateInOwnFrameByEpoch(epoch);
    }

    getKeplerianObjectByEpoch(epoch) {
        return this.getComponentByEpoch(epoch).getKeplerianObjectByEpoch(epoch);
    }

    getStateByEpoch(epoch, referenceFrameOrId) {
        return this.getComponentByEpoch(epoch).getStateByEpoch(epoch, referenceFrameOrId);
    }

    getComponentByEpoch(epoch) {
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

        throw new ExceptionOutOfRange(this.object, epoch, this.minEpoch, this.maxEpoch);
    }

    addComponent(trajectory) {
        this.components.push(trajectory);
        trajectory.setParent(this);

        if (this.isSelected) {
            trajectory.select();
        }

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

    clearAfterEpoch(epoch) {
        while (this.components[this.components.length - 1].minEpoch >= epoch) {
            this.components[this.components.length - 1].drop();
            this.components.pop();
        }
    }
}
