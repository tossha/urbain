import Events from "../../core/Events";
import UIPanel from "../Panel";
import { TWENTY_FOUR_HOURS_IN_SECONDS } from "../../constants/dates";

const MAX_TIME_SCALE = TWENTY_FOUR_HOURS_IN_SECONDS * 30 * 6;

export default class UIPanelTime extends UIPanel {
    /**
     * @param panelDom
     * @param {SimulationEngine} simulationEngine
     */
    constructor(panelDom, simulationEngine) {
        super(panelDom);

        this.jqSlider = this.jqDom.find('#timeScaleSlider');
        this.jqSlider.on('input change', () => simulationEngine.time.setTimeScale(this._getCurrentTimeScale()));
        this.jqSlider.val(this._getNeededSliderValue(simulationEngine.time.timeScale));

        this.jqScaleText = this.jqDom.find('#timeScaleValue');
        this.jqScaleText.html(this._formatTimeScale(simulationEngine.time.timeScale));

        document.addEventListener(Events.TIME_SCALE_CHANGED, (event) => {
            this.jqSlider.val(this._getNeededSliderValue(event.detail.new));
            this.jqScaleText.html(this._formatTimeScale(event.detail.new));
        });

        this.jqDateText = this.jqDom.find('#currentDateValue');

        const updateTime = date => {
            this.jqDateText.html(simulationEngine.time.formatDateFull(date));
        };

        document.addEventListener(Events.EPOCH_CHANGED, (event) => updateTime(event.detail.date));

        this.jqDom.find('#setRealTimeScale').click(() => simulationEngine.time.setTimeScale(1));
        this.jqDom.find('#useCurrentTime').click(() => simulationEngine.time.useCurrentTime());
    }

    /**
     * @returns {number} — simulation seconds per 1 real life second
     */
    _getCurrentTimeScale() {
        const val = this.jqSlider.val();
        return Math.sign(val) * val * val * val * val * MAX_TIME_SCALE;
    }

    _getNeededSliderValue(timeScale) {
        const val = Math.sqrt(Math.sqrt(Math.abs(timeScale) / MAX_TIME_SCALE));
        return Math.sign(timeScale) * Math.min(1, val);
    }

    _formatTimeScale(scale) {
        const precision = 2;

        const prefix = (scale < 0) ? '-' : '';
        const abs = Math.abs(scale);
        if (abs === 0) {
            return '0';
        }

        if (abs < 60) {
            return prefix + abs.toPrecision(precision) + ' s/s';
        }

        if (abs < 3600) {
            return prefix + (abs / 60).toPrecision(precision) + ' min/s';
        }

        if (abs < TWENTY_FOUR_HOURS_IN_SECONDS) {
            return prefix + (abs / 3600).toPrecision(precision) + ' h/s';
        }

        if (abs < 2592000) {
            return prefix + (abs / TWENTY_FOUR_HOURS_IN_SECONDS).toPrecision(precision) + ' days/s';
        }

        if (abs < 31557600) {
            return prefix + (abs / 2592000).toPrecision(precision) + ' months/s';
        }

        return prefix + (abs / 31557600).toPrecision(precision) + ' years/s';
    }
}
