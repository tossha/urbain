import { computed, observable, action } from "mobx";

class EpochModel {
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
}

export default EpochModel;
