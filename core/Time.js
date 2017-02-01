class Time
{
    constructor(settings) {
        this.epoch = settings.timeLine;
        this.settings = settings;
    }

    tick(timePassed) {
        if (this.settings.isTimeRunning) {
            this.epoch += timePassed * this.settings.timeScale;
            this.settings.timeLine = this.epoch;
            this.settings.timeLineController.updateDisplay();
            this.settings.currentDate = (new Date((946728000 + this.epoch) * 1000)).toString();
        }
    }

    forceEpoch(newEpoch) {
        this.epoch = newEpoch;
        this.settings.currentDate = (new Date((946728000 + this.epoch) * 1000)).toString();
    }
}