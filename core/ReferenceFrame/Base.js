class ReferenceFrameBase extends ReferenceFrameAbstract
{
    transformStateVectorByEpoch(epoch, state, destinationFrame) {
        if (this === destinationFrame) {
            return state;
        }

        return destinationFrame.stateVectorFromBaseReferenceFrameByEpoch(
            epoch,
            state
        );
    }
}