import Events from "../core/Events";
import { TWENTY_FOUR_HOURS_IN_SECONDS } from "../constants/dates";

const J2000_TIMESTAMP = 946728000;
const LEFT_BUTTON_KEY_CODE = 0;
const RIGHT_BUTTON_KEY_CODE = 2;

class TimeLine {
    /**
     * @param {number} initialEpoch
     * @param {number} initialTimeScale
     * @param {TimeModel} timeModel
     */
    constructor(initialEpoch, initialTimeScale, timeModel) {
        this._timeScale = initialTimeScale;
        this._timeModel = timeModel;
        this._timeModel.setEpoch(initialEpoch);

        this._mouseState = {
            x: 0,
            y: 0,
            leftButton: false,
            rightButton: false
        };

        this._timeLineCanvasDomElement = document.getElementById("timeLineCanvas");
        this._canvasContext = this._timeLineCanvasDomElement.getContext("2d");
        this._canvasRect = {};
        this._updateCanvasStyle();
        this.initValues();

        this._timeLineCanvasDomElement.addEventListener("mousedown", this._onMouseDown);
        window                       .addEventListener("mouseup", this._onMouseUp);
        window                       .addEventListener("mousemove", this._onMouseMove);
        this._timeLineCanvasDomElement.addEventListener("wheel", this._onMouseWheel);

        window.addEventListener("resize", this._updateCanvasStyle);
    }

    initValues() {
        this.scales = {
            minute: 60,
            fiveMinutes: 300,
            tenMinutes: 600,
            thirtyMinutes: 1800,
            hour: 3600,
            threeHours: 10800,
            sixHours: 21600,
            day: TWENTY_FOUR_HOURS_IN_SECONDS,
            week: 604800,
            month: 2592000,
            threeMonths: 7776000,
            year: 31557600,
            fiveYears: 157788000,
        };

        this._span = this.timeScale * TWENTY_FOUR_HOURS_IN_SECONDS * 5;
        this._markDistance = 300;
        this._scaleType = "month";
        this._leftEpoch = this.epoch - this._span / 2;

        this.updateScaleType();

        this.getDateByEpoch = TimeLine.getDateByEpoch;
        this.getEpochByDate = TimeLine.getEpochByDate;

        this.roundDateUp = TimeLine.roundDateUp;
        this.nextRenderingDate = TimeLine.nextRenderingDate;
        this.formatDate = TimeLine.formatDate;
        this.formatDateFull = TimeLine.formatDateFull;
    }

    /**
     * @param {number} newScale
     */
    setTimeScale(newScale) {
        Events.dispatch(Events.TIME_SCALE_CHANGED, { old: this.timeScale, new: newScale });
        this._timeScale = newScale;
    }

    tick(timePassed) {
        if (this._mouseState.leftButton) {
            this._timeModel.setEpoch(
                this._leftEpoch + (this._mouseState.x - this._canvasRect.left) * this._span / this._timeLineCanvasDomElement.width
            );
        } else if (this.isTimeRunning) {
            if ((this._leftEpoch < this.epoch)
                && (this.epoch < this._leftEpoch + this._span)
            ) {
                this._leftEpoch += this.timeScale * timePassed;
            }

            this._timeModel.setEpoch(this.epoch + this.timeScale * timePassed);
        }

        Events.dispatch(Events.EPOCH_CHANGED, {
            epoch: this.epoch,
            date: this.getDateByEpoch(this.epoch)
        });

        this._redraw();
    }

    forceEpoch(newEpoch) {
        this._leftEpoch += newEpoch - this.epoch;
        this._timeModel.setEpoch(newEpoch);
        this.tick(0);
    }

    useCurrentTime() {
        this.forceEpoch(this.getEpochByDate(new Date()));
    }

    _redraw() {
        this._canvasContext.fillStyle = "#222";
        this._canvasContext.fillRect(0, 0, this._timeLineCanvasDomElement.width, this._timeLineCanvasDomElement.height);

        this._canvasContext.fillStyle = this.isTimeRunning ? "#2846ed" : "#393b40";
        this._drawCurrentTimeMark();

        this._canvasContext.strokeStyle = "#fdfdfd";
        this._canvasContext.fillStyle   = "#fdfdfd";
        this._canvasContext.font        = "11px sans-serif";

        let markDate = this.roundDateUp(this.getDateByEpoch(this._leftEpoch), this._scaleType);
        let markEpoch = this.getEpochByDate(markDate);

        while (markEpoch < this._leftEpoch + this._span) {
            this._drawMark(this._getCanvasPositionByEpoch(markEpoch), this.formatDate(markDate, this._scaleType));
            markDate = this.nextRenderingDate(markDate, this._scaleType);
            markEpoch = this.getEpochByDate(markDate);
        }
    }

    _getCanvasPositionByEpoch(epoch) {
        return (epoch - this._leftEpoch) * this._timeLineCanvasDomElement.width / this._span;
    }

    _updateCanvasStyle = () => {
        this._canvasRect = this._timeLineCanvasDomElement.getBoundingClientRect();
        this._timeLineCanvasDomElement.width  = this._canvasRect.right  - this._canvasRect.left;
        this._timeLineCanvasDomElement.height = this._canvasRect.bottom - this._canvasRect.top;
    };

    updateScaleType() {
        const secondsPerPeriod = this._markDistance * this._span / this._timeLineCanvasDomElement.width;
        let bestScale = false;

        for (const scale in this.scales) {
            if (!bestScale) {
                bestScale = scale;
                continue;
            }

            if (Math.abs(this.scales[bestScale] / secondsPerPeriod - 1)
                > Math.abs(this.scales[scale] / secondsPerPeriod - 1)
            ) {
                bestScale = scale;
            }
        }

        this._scaleType = bestScale;
    }

    _drawMark(x, text) {
        this._canvasContext.beginPath();
        this._canvasContext.moveTo(x, 0);
        this._canvasContext.lineTo(x, this._timeLineCanvasDomElement.height / 2);
        this._canvasContext.stroke();
        this._canvasContext.fillText(
            text,
            x - this._canvasContext.measureText(text).width / 2,
            this._timeLineCanvasDomElement.height - 2
        );
    }

    _drawCurrentTimeMark() {
        this._canvasContext.fillRect(0, 0, this._getCanvasPositionByEpoch(this.epoch), this._timeLineCanvasDomElement.height);
    }

    _onMouseDown = e => {
        if (e.button === LEFT_BUTTON_KEY_CODE) {
            this._mouseState.leftButton = true;
        } else if (e.button === RIGHT_BUTTON_KEY_CODE) {
            this._mouseState.rightButton = true;
        }
        return false;
    };

    _onMouseUp = e => {
        if (e.button === LEFT_BUTTON_KEY_CODE) {
            this._mouseState.leftButton = false;
        } else if (e.button === RIGHT_BUTTON_KEY_CODE) {
            this._mouseState.rightButton = false;
        }
        return false;
    };

    _onMouseMove = e => {
        if (this._mouseState.rightButton) {
            this._leftEpoch += (this._mouseState.x - e.x) * this._span / this._timeLineCanvasDomElement.width;
        }

        this._mouseState.x = e.x;
        this._mouseState.y = e.y;
        return false;
    };

    _getMinScale() {
        return Object.keys(this.scales).reduce((a, b) => this.scales[a] < this.scales[b] ? a : b);
    }

    _getMaxScale() {
        return Object.keys(this.scales).reduce((a, b) => this.scales[a] > this.scales[b] ? a : b);
    }

    _onMouseWheel = e => {
        const stepMult = 1.3;
        const mult = (e.deltaY > 0) ? stepMult : (1 / stepMult);
        const newSpan = Math.min(Math.max(this._span * mult,
            (this._canvasRect.right - this._canvasRect.left) / this._markDistance * this.scales[this._getMinScale()]),
            (this._canvasRect.right - this._canvasRect.left) / this._markDistance * this.scales[this._getMaxScale()]);
        this._leftEpoch += (this._mouseState.x - this._canvasRect.left)
            * (this._span - newSpan) / (this._canvasRect.right - this._canvasRect.left);
        this._span = newSpan;

        this.updateScaleType();
        return false;
    };

    /**
     * @return {number}
     */
    get epoch() {
        return this._timeModel.epoch;
    }

    /**
     * @return {number}
     */
    get timeScale() {
        return this._timeScale;
    }

    /**
     * @return {boolean}
     */
    get isTimeRunning() {
        return !this._timeModel.isPaused;
    }

    /**
     * @param {number} epoch
     * @return {Date}
     */
    static getDateByEpoch(epoch) {
        return new Date((J2000_TIMESTAMP + epoch) * 1000);
    }

    /**
     * @param {Date} date
     * @return {number}
     */
    static getEpochByDate(date) {
        return date / 1000 - J2000_TIMESTAMP;
    }

    /**
     * @param {Date} date
     * @param scaleType
     * @return {*}
     */
    static roundDateUp(date, scaleType) {
        const d = new Date(date);
        if (scaleType === "minute") {
            d.setSeconds(60, 0);
        } else if (scaleType === "fiveMinutes") {
            d.setMinutes(5 + d.getMinutes() - d.getMinutes() % 5, 0, 0);
        } else if (scaleType === "tenMinutes") {
            d.setMinutes(10 + d.getMinutes() - d.getMinutes() % 10, 0, 0);
        } else if (scaleType === "thirtyMinutes") {
            d.setMinutes(30 + d.getMinutes() - d.getMinutes() % 30, 0, 0);
        } else if (scaleType === "hour") {
            d.setMinutes(60, 0, 0);
        } else if (scaleType === "threeHours") {
            d.setHours(3 + d.getHours() - d.getHours() % 3, 0, 0, 0);
        } else if (scaleType === "sixHours") {
            d.setHours(6 + d.getHours() - d.getHours() % 6, 0, 0, 0);
        } else if (scaleType === "day") {
            d.setHours(24, 0, 0, 0);
        } else if (scaleType === "week") {
            d.setHours(0, 0, 0, 0);
            d.setDate(7 + d.getDate() - d.getDay());
        } else if (scaleType === "month") {
            d.setHours(0, 0, 0, 0);
            d.setDate(1);
            d.setMonth(d.getMonth() + 1);
        } else if (scaleType === "threeMonths") {
            d.setHours(0, 0, 0, 0);
            d.setDate(1);
            d.setMonth(3 + d.getMonth() - d.getMonth() % 3);
        } else if (scaleType === "year") {
            d.setHours(0, 0, 0, 0);
            d.setMonth(0, 1);
        } else if (scaleType === "fiveYears") {
            d.setHours(0, 0, 0, 0);
            d.setFullYear(5 + d.getFullYear() - d.getFullYear() % 5, 0, 1);
        } else {
            return;
        }
        return d;
    }

    /**
     * @param {Date} date
     * @param scaleType
     * @return {*}
     */
    static nextRenderingDate(date, scaleType) {
        const d = new Date(date);
        if (scaleType === "minute") {
            d.setMinutes(d.getMinutes() + 1);
        } else if (scaleType === "fiveMinutes") {
            d.setMinutes(d.getMinutes() + 5);
        } else if (scaleType === "tenMinutes") {
            d.setMinutes(d.getMinutes() + 10);
        } else if (scaleType === "thirtyMinutes") {
            d.setMinutes(d.getMinutes() + 30);
        } else if (scaleType === "hour") {
            d.setHours(d.getHours() + 1);
        } else if (scaleType === "threeHours") {
            d.setHours(d.getHours() + 3);
        } else if (scaleType === "sixHours") {
            d.setHours(d.getHours() + 6);
        } else if (scaleType === "day") {
            d.setDate(d.getDate() + 1);
        } else if (scaleType === "week") {
            d.setDate(d.getDate() + 7);
        } else if (scaleType === "month") {
            d.setMonth(d.getMonth() + 1);
        } else if (scaleType === "threeMonths") {
            d.setMonth(d.getMonth() + 3);
        } else if (scaleType === "year") {
            d.setFullYear(d.getFullYear() + 1, d.getMonth(), d.getDate());
        } else if (scaleType === "fiveYears") {
            d.setFullYear(d.getFullYear() + 5, d.getMonth(), d.getDate());
        } else {
            return;
        }
        return d;
    }

    /**
     * @param {Date} date
     * @param scaleType
     * @return {string|*}
     */
    static formatDate(date, scaleType) {
        if ((scaleType === "minute")
            || (scaleType === "fiveMinutes")
            || (scaleType === "tenMinutes")
            || (scaleType === "thirtyMinutes")
            || (scaleType === "hour")
            || (scaleType === "threeHours")
            || (scaleType === "sixHours")
        ) {
            let string = date.getYear() + 1900;
            string += '-' + ((date.getMonth() + 1) + '').padStart(2, '0');
            string += '-' + (date.getDate() + '').padStart(2, '0');
            string += ' ' + (date.getHours() + '').padStart(2, '0');
            string += ':' + (date.getMinutes() + '').padStart(2, '0');
            return string;
        } else if ((scaleType === "day")
            || (scaleType === "week")
        ) {
            let string = date.getYear() + 1900;
            string += '-' + ((date.getMonth() + 1) + '').padStart(2, '0');
            string += '-' + (date.getDate() + '').padStart(2, '0');
            return string;
        } else if ((scaleType === "month")
            || (scaleType === "threeMonths")
        ) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months[date.getMonth()] + ' ' + (date.getYear() + 1900);
        } else if ((scaleType === "year")
            || (scaleType === "fiveYears")
        ) {
            return (date.getYear() + 1900) + '';
        }
        return date.toString();
    }

    /**
     * @param {Date} date
     * @return {string}
     */
    static formatDateFull(date) {
        let string = date.getYear() + 1900;
        string += '-' + ((date.getMonth() + 1) + '').padStart(2, '0');
        string += '-' + (date.getDate() + '').padStart(2, '0');
        string += ' ' + (date.getHours() + '').padStart(2, '0');
        string += ':' + (date.getMinutes() + '').padStart(2, '0');
        string += ':' + (date.getSeconds() + '').padStart(2, '0');
        return string;
    }
}

export default TimeLine;
