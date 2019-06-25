import { action, computed, observable } from "mobx";
import Events from "../../../core/Events";

class EpochModel {
    constructor(universe) {
        this._universe = universe;
    }

    /**
     * @type {number}
     * @private
     */
    @observable
    _epoch = 0;

    /**
     * @return {number}
     */
    @computed
    get epoch() {
        return this._epoch;
    }

    /**
     * @param {number} newEpoch
     */
    @action
    setEpoch(newEpoch) {
        this._epoch = newEpoch;
    }

    @action
    forceEpoch(newEpoch) {
        Events.dispatch(Events.FORCE_EPOCH_CHANGED, {
            newEpoch,
            prevEpoch: this._epoch,
        });

        this._epoch = newEpoch;
    }

    @action
    setCurrentTimeEpoch() {
        const epoch = this._universe.dataTransforms.getEpochByDate(new Date());

        this.forceEpoch(epoch);
    }
}

export default EpochModel;
