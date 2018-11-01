class StepHandlerService {
    constructor(goalPrefix, durationPrefix) {
        this._goalPrefix = goalPrefix;
        this._durationPrefix = durationPrefix;

        this._stepStartTimes = {};
        this._metrika = window.yaCounter47040543;
    }

    handleStep(nextStepIdx) {
        if (!this._metrika || this._stepStartTimes[nextStepIdx] !== undefined) {
            return;
        }

        const stepName = this._goalPrefix + nextStepIdx;

        this._stepStartTimes[nextStepIdx] = +new Date();

        if (nextStepIdx === 0) {
            this._metrika.reachGoal(stepName);
            return;
        }

        const durationName = this._durationPrefix + (nextStepIdx - 1);
        this._metrika.reachGoal(stepName, {
            [durationName]: this._stepStartTimes[nextStepIdx] - this._stepStartTimes[nextStepIdx - 1],
        });
    }
}

export default StepHandlerService;
