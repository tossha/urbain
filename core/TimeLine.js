const MAGICAL_TIME_CONST = 946728000;

class TimeLine
{
    constructor(settings) {
        this.epoch = settings.timeLine; // time in seconds
        this.isMousePressed = false;
        this.settings = settings;
        this.msPerPx = 100 * 60 * 60 * 24;
        
        const canvas = document.getElementById("timeLineCanvas");
        canvas.addEventListener("mousedown", (e) => this.onMouseDown  (e));
        window.addEventListener("mouseup"  , (e) => this.onMouseUp    (e));
        window.addEventListener("mousemove", (e) => this.onMouseMove  (e));
        canvas.addEventListener("wheel"    , (e) => this.onMouseWheel (e));
    }

    tick(timePassed) {
        if (this.settings.isTimeRunning && !this.isMousePressed) {
            this.epoch += this.settings.timeScale * timePassed;
            this.settings.timeLine = this.epoch;
            this.settings.currentDate = "" + new Date((MAGICAL_TIME_CONST + this.epoch) * 1000);
        }

        this.redraw();
    }

    forceEpoch(newEpoch) {
        this.epoch = newEpoch;
        this.tick(0);
    }

    redraw() {
        const canvas = document.getElementById("timeLineCanvas");
        const computedStyle = getComputedStyle(canvas);
        canvas.width = parseFloat(computedStyle.width);
        canvas.height = parseFloat(computedStyle.height);
        
        const context = canvas.getContext("2d");

        context.fillStyle = "#222222";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = "#bbbbbb";
        context.fillStyle   = "#00ee00";
        context.font        = "#14px Courier New";

        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.stroke();

        const centerEpoch = 1000 * (this.epoch + MAGICAL_TIME_CONST);
        let displayEpoch = centerEpoch;
        while (centerEpoch - displayEpoch < this.msPerPx * canvas.width / 2) {
            displayEpoch = this.previousRenderingDate(displayEpoch - 1);
        }

        while (displayEpoch - centerEpoch < this.msPerPx * canvas.width / 2) {
            const position = canvas.width / 2 + (displayEpoch - centerEpoch) / this.msPerPx;
            context.moveTo(position, 0);
            context.lineTo(position, canvas.height / 2);
            context.stroke();
            context.fillText(this.formatDate(displayEpoch), position, canvas.height / 2);
            displayEpoch = this.nextRenderingDate(displayEpoch + 1);
        }
    }

    previousRenderingDate(date) {
        var d = new Date(date);
        d.setDate(1);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return +d;
    }

    nextRenderingDate(date) {
        var d = new Date(date);
        d.setMonth(d.getMonth() + 1);
        d.setDate(1);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return +d;
    }

    formatDate(date) {
        const d = new Date(date);
        return `${[
            "Январь", "Февраль", "Март",
            "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь",
            "Октябрь", "Ноябрь", "Декабрь"
        ][d.getMonth()]} ${d.getFullYear()}`;
    }

    onMouseDown(e) {
        this.isMousePressed = true;
    }

    onMouseUp(e) {
        this.isMousePressed = false;
    }

    onMouseMove(e) {
        if (this.isMousePressed) {
            this.epoch += (this.mouseX - e.clientX) * this.msPerPx / 1000;
        }

        this.mouseX = e.clientX;
    }

    onMouseWheel(e) {
        this.msPerPx = Math.max(1000, Math.min(1000 * 60 * 60 * 24, this.msPerPx * (1 + 0.05 * e.deltaY)));
    }
}

var alreadyPrinted = false;

