import Events from "../core/Events";

export const J2000_TIMESTAMP = 946728000;

export default class TimeLine
{
    /**
     * @param epoch
     * @param timeScale
     * @param {TimeModel} timeModel
     */
    constructor(epoch, timeScale, timeModel) {
        this.epoch = epoch;
        this.timeScale = timeScale;
        this._timeModel = timeModel;

        this.mouseState = {
            x: 0,
            y: 0,
            leftButton: false,
            rightButton: false
        };

        this.timeLineCanvasDomElement = document.getElementById("timeLineCanvas");
        this.canvasContext = this.timeLineCanvasDomElement.getContext("2d");
        this.canvasRect = {};
        this.updateCanvasStyle();
        this.initValues();

        this.timeLineCanvasDomElement.addEventListener("mousedown",  this.onMouseDown  .bind(this));
        window                       .addEventListener("mouseup",    this.onMouseUp    .bind(this));
        window                       .addEventListener("mousemove",  this.onMouseMove  .bind(this));
        this.timeLineCanvasDomElement.addEventListener("wheel",      this.onMouseWheel .bind(this));

        window.addEventListener('keypress', e => {
            if (e.key === ' ') {
                this._timeModel.togglePause();
            }
        });

        window.addEventListener("resize", this.updateCanvasStyle.bind(this));
        window.oncontextmenu = () => false;
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
            day: 86400,
            week: 604800,
            month: 2592000,
            threeMonths: 7776000,
            year: 31557600,
            fiveYears: 157788000,
        };

        this.span = this.timeScale * 86400 * 5;
        this.markDistance = 300;
        this.scaleType = "month";
        this.leftEpoch = this.epoch - this.span / 2;

        this.updateScaleType();

        this.getDateByEpoch = TimeLine.getDateByEpoch;
        this.getEpochByDate = TimeLine.getEpochByDate;

        this.roundDateUp = TimeLine.roundDateUp;
        this.nextRenderingDate = TimeLine.nextRenderingDate;
        this.formatDate = TimeLine.formatDate;
        this.formatDateFull = TimeLine.formatDateFull;
    }

    setTimeScale(newScale) {
        Events.dispatch(Events.TIME_SCALE_CHANGED, {old: this.timeScale, new: newScale});
        this.timeScale = newScale;
    }

    tick(timePassed) {
        if (this.mouseState.leftButton) {
            this.epoch = this.leftEpoch + (this.mouseState.x
                - this.canvasRect.left) * this.span / this.timeLineCanvasDomElement.width;
        } else if (this.isTimeRunning) {
            if ((this.leftEpoch < this.epoch)
                && (this.epoch < this.leftEpoch + this.span)
            ) {
                this.leftEpoch += this.timeScale * timePassed;
            }

            this.epoch += this.timeScale * timePassed;
        }

        Events.dispatch(Events.EPOCH_CHANGED, {
            epoch: this.epoch,
            date: this.getDateByEpoch(this.epoch)
        });

        this.redraw();
    }

    forceEpoch(newEpoch) {
        this.leftEpoch += newEpoch - this.epoch;
        this.epoch = newEpoch;
        this.tick(0);
    }

    useCurrentTime() {
        this.forceEpoch(this.getEpochByDate(new Date()));
    }

    redraw() {
        this.canvasContext.fillStyle = "#222";
        this.canvasContext.fillRect(0, 0, this.timeLineCanvasDomElement.width, this.timeLineCanvasDomElement.height);

        this.canvasContext.fillStyle = this.isTimeRunning ? "#2846ed" : "#393b40";
        this.drawCurrentTimeMark();

        this.canvasContext.strokeStyle = "#fdfdfd";
        this.canvasContext.fillStyle   = "#fdfdfd";
        this.canvasContext.font        = "11px sans-serif";

        let markDate = this.roundDateUp(this.getDateByEpoch(this.leftEpoch), this.scaleType);
        let markEpoch = this.getEpochByDate(markDate);

        while (markEpoch < this.leftEpoch + this.span) {
            this.drawMark(this.getCanvasPositionByEpoch(markEpoch), this.formatDate(markDate, this.scaleType));
            markDate = this.nextRenderingDate(markDate, this.scaleType);
            markEpoch = this.getEpochByDate(markDate);
        }
    }

    getCanvasPositionByEpoch(epoch) {
        return (epoch - this.leftEpoch) * this.timeLineCanvasDomElement.width / this.span;
    }

    updateCanvasStyle() {
        this.canvasRect = this.timeLineCanvasDomElement.getBoundingClientRect();
        this.timeLineCanvasDomElement.width  = this.canvasRect.right  - this.canvasRect.left;
        this.timeLineCanvasDomElement.height = this.canvasRect.bottom - this.canvasRect.top;
    }

    updateScaleType() {
        const secondsPerPeriod = this.markDistance * this.span / this.timeLineCanvasDomElement.width;
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

        this.scaleType = bestScale;
    }

    drawMark(x, text) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(x, 0);
        this.canvasContext.lineTo(x, this.timeLineCanvasDomElement.height / 2);
        this.canvasContext.stroke();
        this.canvasContext.fillText(
            text,
            x - this.canvasContext.measureText(text).width / 2,
            this.timeLineCanvasDomElement.height - 2
        );
    }

    drawCurrentTimeMark() {
        this.canvasContext.fillRect(0, 0, this.getCanvasPositionByEpoch(this.epoch), this.timeLineCanvasDomElement.height);
    }

    onMouseDown(e) {
        if (e.button === 0) {
            this.mouseState.leftButton = true;
        } else if (e.button === 2) {
            this.mouseState.rightButton = true;
        }
        return false;
    }

    onMouseUp(e) {
        if (e.button === 0) {
            this.mouseState.leftButton = false;
        } else if (e.button === 2) {
            this.mouseState.rightButton = false;
        }
        return false;
    }

    onMouseMove(e) {
        if (this.mouseState.rightButton) {
            this.leftEpoch += (this.mouseState.x - e.x) * this.span / this.timeLineCanvasDomElement.width;
        }

        this.mouseState.x = e.x;
        this.mouseState.y = e.y;
        return false;
    }

    getMinScale() {
        return Object.keys(this.scales).reduce((a, b) => { return this.scales[a] < this.scales[b] ? a : b });
    }

    getMaxScale() {
        return Object.keys(this.scales).reduce((a, b) => { return this.scales[a] > this.scales[b] ? a : b });
    }

    onMouseWheel(e) {
        const stepMult = 1.3;
        const mult = (e.deltaY > 0) ? stepMult : (1 / stepMult);
        const newSpan = Math.min(Math.max(this.span * mult,
            (this.canvasRect.right - this.canvasRect.left) / this.markDistance * this.scales[this.getMinScale()]),
            (this.canvasRect.right - this.canvasRect.left) / this.markDistance * this.scales[this.getMaxScale()]);
        this.leftEpoch += (this.mouseState.x - this.canvasRect.left)
            * (this.span - newSpan) / (this.canvasRect.right - this.canvasRect.left);
        this.span = newSpan;

        this.updateScaleType();
        return false;
    }

    get isTimeRunning() {
        return !this._timeModel.isPaused;
    }

    static getDateByEpoch(epoch) {
        return new Date((J2000_TIMESTAMP + epoch) * 1000);
    }

    static getEpochByDate(date) {
        return date / 1000 - J2000_TIMESTAMP;
    }

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
