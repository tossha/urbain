class ReferenceFrameAbstract
{
    getQuaternionByEpoch(epoch) {
        return IDENTITY_QUATERNION;
    }

    getOriginPositionByEpoch(epoch) {
        return new Vector(3);
    }

    getOriginStateByEpoch(epoch) {
        return new StateVector();
    }

    transformStateVectorByEpoch(epoch, state, destinationFrame) {
        if (this === destinationFrame) {
            return state;
        }

        if (this === RF_BASE) {
            return destinationFrame.stateVectorFromBaseReferenceFrameByEpoch(
                epoch,
                state
            );
        }

        if (destinationFrame === RF_BASE) {
            return this.stateVectorToBaseReferenceFrameByEpoch(epoch, state);
        }

        return destinationFrame.stateVectorFromBaseReferenceFrameByEpoch(
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