class TimeStore {
    /**
     * @param {TimeModel} timeModel
     */
    constructor(timeModel) {
        this._time = timeModel;
    }

    /**
     * @return {TimeModel}
     */
    get currentTimeState() {
        return this._time;
    }
}

export default TimeStore;
