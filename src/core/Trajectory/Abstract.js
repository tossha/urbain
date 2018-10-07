import StateVector from "../StateVector";
import {RF_BASE} from "../ReferenceFrame/Factory";
import KeplerianObject from "../KeplerianObject";
import ExceptionOutOfRange from "./ExceptionOutOfRange";
import FunctionOfEpochCustom from "../FunctionOfEpoch/Custom";
import ReferenceFrameInertialDynamic from "../ReferenceFrame/InertialDynamic";
import KeplerianEditor from "../KeplerianEditor";
import {Quaternion} from "../algebra";
import ReferenceFrameAbstract from "../ReferenceFrame/Abstract";
import { sim } from "../Simulation";
import Events from "../Events";

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

        this.isEditable = false;
        this.isSelected = false;

        this.propagator = null;

        this.showOrbitAnglesListener = this._onShowOrbitAnglesChange.bind(this);

        this.orbitalReferenceFrame = new ReferenceFrameInertialDynamic(
            new FunctionOfEpochCustom(epoch => this.getStateByEpoch(epoch)),
            new FunctionOfEpochCustom(epoch => {
                const state = this.getStateInOwnFrameByEpoch(epoch);
                return Quaternion.twoAxis(state.velocity, null, state.position);
            }),
        );

        this.pericentricReferenceFrame = new ReferenceFrameInertialDynamic(
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

    isEditableAtEpoch(epoch) {
        return this.isEditable;
    }

    setReferenceFrame(referenceFrameId) {
        this.referenceFrame = sim.starSystem.getReferenceFrame(referenceFrameId);
    }

    getReferenceFrameByEpoch(epoch) {
        return this.referenceFrame;
    }

    _transformKeplerianObject(keplerianObject, destinationFrameOrId, epoch) {
        if (destinationFrameOrId === undefined) {
            return keplerianObject;
        }

        let destinationFrame = (destinationFrameOrId instanceof ReferenceFrameAbstract)
            ? destinationFrameOrId
            : sim.starSystem.getReferenceFrame(destinationFrameOrId);
        if (epoch === undefined) {
            epoch = keplerianObject.epoch;
        }
        return KeplerianObject.createFromState(
            this.referenceFrame.transformStateVectorByEpoch(
                epoch,
                keplerianObject.getStateByEpoch(epoch),
                destinationFrame
            ),
            destinationFrame.mu,
            epoch
        );
    }

    getKeplerianObjectByEpoch(epoch, referenceFrameOrId) {
        let destinationFrame = (referenceFrameOrId instanceof ReferenceFrameAbstract)
            ? referenceFrameOrId
            : referenceFrameOrId !== undefined
                ? sim.starSystem.getReferenceFrame(referenceFrameOrId)
                : this.getReferenceFrameByEpoch(epoch);
        return KeplerianObject.createFromState(
            this.getStateByEpoch(epoch, destinationFrame),
            destinationFrame.mu,
            epoch
        );
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
        if (this.isSelected) {
            this.deselect();
        }
        if (this.visualModel) {
            this.visualModel.drop();
        }
    }

    select() {
        this.isSelected = true;
        this.visualModel && this.visualModel.select();
        this.keplerianEditor = new KeplerianEditor(this);
        Events.addListener(Events.SHOW_ORBIT_ANGLES_CHANGED, this.showOrbitAnglesListener);
    }

    deselect() {
        this.isSelected = false;
        this.visualModel && this.visualModel.deselect();
        if (this.keplerianEditor) {
            this.keplerianEditor.remove();
            delete this.keplerianEditor;
            Events.removeListener(Events.SHOW_ORBIT_ANGLES_CHANGED, this.showOrbitAnglesListener);
        }
    }

    _onShowOrbitAnglesChange(event) {
        if (event.detail.value) {
            this.keplerianEditor.init();
        } else {
            this.keplerianEditor.remove();
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
            throw new ExceptionOutOfRange(this.object, this, epoch, this.minEpoch, this.maxEpoch);
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
