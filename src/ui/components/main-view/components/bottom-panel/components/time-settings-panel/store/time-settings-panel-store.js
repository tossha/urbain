import { computed } from "mobx";
import { TWENTY_FOUR_HOURS_IN_SECONDS } from "../../../../../../../../constants/dates";
import { formatTimeScale } from "./helpers/format-time-scale";

const MAX_TIME_SCALE = TWENTY_FOUR_HOURS_IN_SECONDS * 30 * 6;

/**
 * @returns {number} — simulation seconds per 1 real life second
 */
function convertToTimeScale(sliderValue) {
    const val = sliderValue;

    return Math.sign(val) * val * val * val * val * MAX_TIME_SCALE;
}

class TimeSettingsPanelStore {
    /**
     * @param {TimeModel} timeModel
     * @param {Universe} universe
     */
    constructor(timeModel, universe) {
        this._timeModel = timeModel;
        this._universe = universe;
    }

    @computed
    get formattedDate() {
        const date = this._universe.dataTransforms.getDateByEpoch(this._timeModel.epoch);

        return this._universe.dataTransforms.formatDateFull(date);
    }

    @computed
    get formattedTimeScale() {
        return formatTimeScale(this._timeModel.timeScale);
    }

    @computed
    get sliderValue() {
        const timeScale = this._timeModel.timeScale;
        const val = Math.sqrt(Math.sqrt(Math.abs(timeScale) / MAX_TIME_SCALE));

        return Math.sign(timeScale) * Math.min(1, val);
    }

    onSetRealTimeScale = () => {
        this._timeModel.setTimeScale(1);
    };

    onSetCurrentTime = () => {
        this._timeModel.setCurrentTimeEpoch();
    };

    onTimeScaleSliderChange = event => {
        this._timeModel.setTimeScale(convertToTimeScale(event.target.value));
    };
}

export default TimeSettingsPanelStore;
