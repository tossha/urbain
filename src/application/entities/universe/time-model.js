import { observable, action, computed } from "mobx";
import EpochModel from "./epoch-model";

class TimeModel extends EpochModel {
    /**
     * @type {boolean}
     * @private
     */
    @observable
    _isPaused = true;

    @computed
    get isPaused() {
        return this._isPaused;
    }

    @action
    togglePause() {
        this._isPaused = !this._isPaused;
    }

    @action
    run() {
        this._isPaused = false;
    }
}

export default TimeModel;
