import StateVector from "../StateVector";
import {RF_BASE} from "../ReferenceFrame/Factory";
import KeplerianObject from "../KeplerianObject";
import ExceptionOutOfRange from "./ExceptionOutOfRange";
import FunctionOfEpochCustom from "../FunctionOfEpoch/Custom";
import ReferenceFrameInertialDynamic from "../ReferenceFrame/InertialDynamic";
import KeplerianEditor from "../KeplerianEditor";

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

        this.orbitalReferenceFrame = new ReferenceFrameInertialDynamic(
            new FunctionOfEpochCustom((epoch) => {
                return this.getReferenceFrameByEpoch(epoch).getOriginStateByEpoch(epoch);
            }),
            new FunctionOfEpochCustom((epoch) => {
                const quat = this.getReferenceFrameByEpoch(epoch).getQuaternionByEpoch(epoch);
                const ko = this.getKeplerianObjectByEpoch(epoch);
                return quat.mul_(ko.getOrbitalFrameQuaternion());
            })
        );
    }

    setReferenceFrame(referenceFrameId) {
        this.referenceFrame = sim.starSystem.getReferenceFrame(referenceFrameId);
    }

    getReferenceFrameByEpoch(epoch) {
        return this.referenceFrame;
    }

    getKeplerianObjectByEpoch(epoch) {
        const rf = this.getReferenceFrameByEpoch(epoch);
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
        if (!this.parent) {
            this.keplerianEditor = new KeplerianEditor(this, this.keplerianObject !== undefined);
        }
    }

    deselect() {
        this.visualModel && this.visualModel.deselect();
        if (this.keplerianEditor) {
            this.keplerianEditor.remove();
            delete this.keplerianEditor;
        }
    }

    isValidAtEpoch(epoch) {
        if (this.minEpoch !== null && this.minEpoch !== false) {
            if (epoch < this.minEpoch) {
                return false;
            }
        }
        if (this.maxEpoch !== null && this.maxEpoch !== false) {
            if (epoch > this.maxEpoch) {
                return false;
            }
        }
        return true;
    }

    validateEpoch(epoch) {
        if (!this.isValidAtEpoch(epoch)) {
            throw new ExceptionOutOfRange(this.object, epoch, this.minEpoch, this.maxEpoch);
        }
    }

    getStateInOwnFrameByEpoch(epoch) {
        this.validateEpoch(epoch);
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
        return this.getStateByEpoch(epoch, referenceFrameOrId).position;
    }

    getVelocityByEpoch(epoch, referenceFrameOrId) {
        return this.getStateByEpoch(epoch, referenceFrameOrId).velocity;
    }
}