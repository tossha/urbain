class ReferenceFrameAbstract
{
    constructor(origin) {
        this.origin = origin;
    }

    getQuaternionByEpoch(epoch) {
        return IDENTITY_QUATERNION;
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
            new StateVector(pos.x, pos.y, pos.z, 0, 0, 0),
            destinationFrame
        ).position;
    }

    stateVectorFromBaseReferenceFrameByEpoch(epoch, state) {}
    stateVectorToBaseReferenceFrameByEpoch(epoch, state) {}
}