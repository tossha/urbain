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
import FlightEventSOIDeparture from "../../modules/PatchedConics/FlightEvent/SOIDeparture";
import FlightEventSOIArrival from "../../modules/PatchedConics/FlightEvent/SOIArrival";

/**
 * Fields:
 *  minEpoch/  - (float) time limits where the trajectory is defined
 *  maxEpoch     (false) there is no limit
 */
export default class TrajectoryAbstract
{
    constructor() {
        this.minEpoch = false;
        this.maxEpoch = false;

        this.cachedEpoch = null;
        this.cachedState = null;

        this.visualModel = null;
        this.object = null;

        this.parent = null;

        this.referenceFrame = null;

        this.isEditable = false;
        this.isSelected = false;

        this.propagator = null;

        this.flightEvents = [];

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

    addFlightEvent(flightEvent) {
        if (flightEvent instanceof FlightEventSOIDeparture || flightEvent instanceof FlightEventSOIArrival) {
            for (let event of this.flightEvents) {
                if (event.constructor === flightEvent.constructor) {
                    event.copy(flightEvent);
                    return;
                }
            }
        }
        this.flightEvents.push(flightEvent);
        this.visualModel && this.visualModel.addFlightEvent(flightEvent);
    }

    clearAfterEpoch(epoch) {
        let newEvents = [];
        for (let event of this.flightEvents) {
            if (event.epoch <= epoch) {
                newEvents.push(event);
            } else {
                this.visualModel && this.visualModel.removeFlightEvent(event);
            }
        }
        this.flightEvents = newEvents;
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
        return (this.minEpoch === false || epoch >= this.minEpoch)
            && (this.maxEpoch === false || epoch <= this.maxEpoch);
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

    getStateByEpoch(epoch, referenceFrameOrId, frameEpoch = null) {
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

        return this.referenceFrame.transformStateVectorByEpoch((frameEpoch === null) ? epoch : frameEpoch, state, referenceFrameOrId);
    }

    getPositionByEpoch(epoch, referenceFrameOrId, frameEpoch = null) {
        return this.getStateByEpoch(epoch, referenceFrameOrId, frameEpoch).position;
    }
}
