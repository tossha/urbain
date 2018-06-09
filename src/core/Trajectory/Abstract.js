import StateVector from "../StateVector";
import {RF_BASE} from "../ReferenceFrame/Factory";
import KeplerianObject from "../KeplerianObject";

export default class TrajectoryAbstract
{
    constructor() {
        this.minEpoch = null;
        this.maxEpoch = null;

        this.cachedEpoch = null;
        this.cachedState = null;

        this.visualModel = null;
        this.object = null;

        this.parent = null;

        this.referenceFrame = null;
    }

    setReferenceFrame(referenceFrameId) {
        this.referenceFrame = sim.starSystem.getReferenceFrame(referenceFrameId);
    }

    getReferenceFrameByEpoch(epoch) {
        return this.referenceFrame;
    }

    getKeplerianObjectByEpoch(epoch) {
        const rf = this.getReferenceFrameByEpoch(epoch);
        if (!rf || !rf.mu) {
            return null;
        }
        return KeplerianObject.createFromState(this.getStateInOwnFrameByEpoch(epoch), rf.mu, epoch);
    }

    setVisualModel(visualModel) {
        this.visualModel = visualModel;
    }

    setParent(parent) {
        this.parent = parent;
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

    getStateByEpoch(epoch, referenceFrameOrId) {
        let state;

        if (this.referenceFrame === null) {
            return null;
        }

        if (referenceFrameOrId === undefined) {
            referenceFrameOrId = RF_BASE;
        }

        if (referenceFrameOrId === RF_BASE && epoch === this.cachedEpoch) {
            state = this.cachedState;
        } else {
            state = this.getStateInOwnFrameByEpoch(epoch);
            if (referenceFrameOrId === RF_BASE && epoch === sim.currentEpoch) {
                this.cachedState = state;
                this.cachedEpoch = epoch;
            }
        }

        if (state === null) {
            return null;
        }

        return this.referenceFrame.transformStateVectorByEpoch(epoch, state, referenceFrameOrId);
    }

    getPositionByEpoch(epoch, referenceFrameOrId) {
        const state = this.getStateByEpoch(epoch, referenceFrameOrId);
        return (state !== null) ? state.position : null;
    }

    getVelocityByEpoch(epoch, referenceFrameOrId) {
        const state = this.getStateByEpoch(epoch, referenceFrameOrId);
        return (state !== null) ? state.velocity : null;
    }
}