import { observable, action, computed } from "mobx";
import EpochModel from "./epoch-model";

class TimeModel extends EpochModel {
    /**
     * @type {boolean}
     * @private
     */
    @observable
    _isPaused = true;

    @observable
    _timeScale = 1;

    @computed
    get isPaused() {
        return this._isPaused;
    }

    /**
     * @return {number}
     */
    @computed
    get timeScale() {
        return this._timeScale;
    }

    @action
    togglePause() {
        this._isPaused = !this._isPaused;
    }

    @action
    run() {
        this._isPaused = false;
    }

    @action
    setTimeScale(newScale) {
        this._timeScale = newScale;
    }
}

export default TimeModel;
