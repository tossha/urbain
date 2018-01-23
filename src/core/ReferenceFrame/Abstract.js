import {Quaternion, Vector} from "../../algebra";
import StateVector from "../StateVector";
import {RF_BASE} from "./Factory";
import ReferenceFrameFactory from "./Factory";

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

    transformStateVectorByEpoch(epoch, state, destinationFrame) {
        let destinationFrameObj = (destinationFrame instanceof ReferenceFrameAbstract)
            ? destinationFrame
            : sim.starSystem.getReferenceFrame(destinationFrame);

        if (this === destinationFrameObj) {
            return state;
        }

        if (this.id === RF_BASE) {
            return destinationFrameObj.stateVectorFromBaseReferenceFrameByEpoch(
                epoch,
                state
            );
        }

        if (destinationFrameObj.id === RF_BASE) {
            return this.stateVectorToBaseReferenceFrameByEpoch(epoch, state);
        }

        return destinationFrameObj.stateVectorFromBaseReferenceFrameByEpoch(
            epoch,
            this.stateVectorToBaseReferenceFrameByEpoch(epoch, state)
        );
    }

    transformPositionByEpoch(epoch, pos, destinationFrame) {
        return this.transformStateVectorByEpoch(
            epoch,
            new StateVector(pos),
            destinationFrame
        ).position;
    }

    stateVectorFromBaseReferenceFrameByEpoch(epoch, state) {}
    stateVectorToBaseReferenceFrameByEpoch(epoch, state) {}
}