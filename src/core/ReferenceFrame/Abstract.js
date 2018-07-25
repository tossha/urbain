import {Quaternion, Vector} from "../algebra";
import StateVector from "../StateVector";
import {RF_BASE} from "./Factory";
import ReferenceFrameFactory from "./Factory";
import { sim } from "../Simulation";

export default class ReferenceFrameAbstract
{
    setId(id) {
        this.id = id;
        this.originId = ReferenceFrameFactory.getOriginIdByReferenceFrameId(id);
        this.type = ReferenceFrameFactory.getTypeByReferenceFrameId(id);
        return this;
    }

    get mu() {
        if (this._mu === undefined) {
            const obj = sim.starSystem.getObject(this.originId);
            this._mu = obj.physicalModel
                ? obj.physicalModel.mu
                : null;
        }
        return this._mu;
    }

    getQuaternionByEpoch(epoch) {
        return new Quaternion();
    }

    getOriginPositionByEpoch(epoch) {
        return new Vector(3);
    }

    getOriginStateByEpoch(epoch) {
        return new StateVector();
    }

    transformStateVectorByEpoch(epoch, state, destinationFrameOrId) {
        let destinationFrame = (destinationFrameOrId instanceof ReferenceFrameAbstract)
            ? destinationFrameOrId
            : sim.starSystem.getReferenceFrame(destinationFrameOrId);

        if (this === destinationFrame) {
            return state;
        }

        if (this.id === RF_BASE) {
            return destinationFrame.stateVectorFromBaseReferenceFrameByEpoch(
                epoch,
                state
            );
        }

        if (destinationFrame.id === RF_BASE) {
            return this.stateVectorToBaseReferenceFrameByEpoch(epoch, state);
        }

        return destinationFrame.stateVectorFromBaseReferenceFrameByEpoch(
            epoch,
            this.stateVectorToBaseReferenceFrameByEpoch(epoch, state)
        );
    }

    transformPositionByEpoch(epoch, pos, destinationFrameOrId) {
        return this.transformStateVectorByEpoch(
            epoch,
            new StateVector(pos),
            destinationFrameOrId
        ).position;
    }

    rotateVectorByEpoch(epoch, vec, destinationFrameOrId) {
        let destinationFrame = (destinationFrameOrId instanceof ReferenceFrameAbstract)
            ? destinationFrameOrId
            : sim.starSystem.getReferenceFrame(destinationFrameOrId);

        if (this === destinationFrame) {
            return vec.copy();
        }

        return destinationFrame.getQuaternionByEpoch(epoch).invert_().mul_(this.getQuaternionByEpoch(epoch)).rotate(vec);
    }

    stateVectorFromBaseReferenceFrameByEpoch(epoch, state) {}
    stateVectorToBaseReferenceFrameByEpoch(epoch, state) {}
}
