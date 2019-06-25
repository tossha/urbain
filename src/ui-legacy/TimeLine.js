import Events from "../core/Events";
import { TWENTY_FOUR_HOURS_IN_SECONDS } from "../constants/dates";

const LEFT_BUTTON_KEY_CODE = 0;
const RIGHT_BUTTON_KEY_CODE = 2;

class TimeLine {
    /**
     * @param {number} initialEpoch
     * @param {TimeModel} timeModel
     * @param {Universe} universe
     */
    constructor(initialEpoch, timeModel, universe) {
        this._timeModel = timeModel;
        this._universe = universe;
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

        this.getDateByEpoch = this._universe.dataTransforms.getDateByEpoch;
        this.getEpochByDate = this._universe.dataTransforms.getEpochByDate;

        this.roundDateUp = this._universe.dataTransforms.roundDateUp;
        this.nextRenderingDate = this._universe.dataTransforms.nextRenderingDate;
        this.formatDate = this._universe.dataTransforms.formatDate;
        this.formatDateFull = this._universe.dataTransforms.formatDateFull;
    }

    /**
     * @param {number} newScale
     */
    setTimeScale(newScale) {
        Events.dispatch(Events.TIME_SCALE_CHANGED, { new: newScale });
        this._timeModel.setTimeScale(newScale);
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
        return this._timeModel.timeScale;
    }

    /**
     * @return {boolean}
     */
    get isTimeRunning() {
        return !this._timeModel.isPaused;
    }
}

export default TimeLine;
