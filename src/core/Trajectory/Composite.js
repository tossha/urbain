import TrajectoryAbstract from "./Abstract";
import ExceptionOutOfRange from "./ExceptionOutOfRange";

export default class TrajectoryComposite extends TrajectoryAbstract
{
    constructor() {
        super();
        this.components = [];
        this.lastUsedTrajectory = null;
    }

    select() {
        this.isSelected = true;
        if (this.selectedVisualModel) {
            this.visualModel.hide();
            this.selectedVisualModel.show();
            this.selectedVisualModel.select();
        } else {
            this.visualModel && this.visualModel.select();
        }
        this.components.map(traj => traj.select());
    }

    deselect() {
        super.deselect();
        this.components.map(traj => traj.deselect());
    }

    drop() {
        super.drop();
        this.components.map(traj => traj.drop());
    }

    setObject(object) {
        super.setObject(object);
        this.components.map(traj => traj.setObject(object));
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

    getStateByEpoch(epoch, referenceFrameOrId, frameEpoch = null) {
        return this.getComponentByEpoch(epoch).getStateByEpoch(epoch, referenceFrameOrId, frameEpoch);
    }

    getComponentByEpoch(epoch, noCache) {
        if (!noCache && this.lastUsedTrajectory
            && (this.lastUsedTrajectory.minEpoch === false || this.lastUsedTrajectory.minEpoch <= epoch)
            && (this.lastUsedTrajectory.maxEpoch === false || this.lastUsedTrajectory.maxEpoch >= epoch)
        ) {
            return this.lastUsedTrajectory;
        }

        for (let trajectory of this.components) {
            if (trajectory.isValidAtEpoch(epoch)) {
                this.lastUsedTrajectory = trajectory;
                return trajectory;
            }
        }

        throw new ExceptionOutOfRange(this.object, this, epoch, this.minEpoch, this.maxEpoch);
    }

    addComponent(trajectory) {
        this.components.push(trajectory);
        trajectory.setParent(this);
        trajectory.setObject(this.object);

        if (this.isSelected) {
            trajectory.select();
        }

        if (this.minEpoch === false
            || (trajectory.minEpoch !== false
                && this.minEpoch > trajectory.minEpoch
            )
        ) {
            this.minEpoch = trajectory.minEpoch;
        }
        if (this.maxEpoch === false
            || (trajectory.maxEpoch !== false
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
        for (let component of this.components) {
            if (component.maxEpoch === false || component.maxEpoch > epoch) {
                component.clearAfterEpoch(epoch);
            }
        }
        this.lastUsedTrajectory = null;
    }
}
