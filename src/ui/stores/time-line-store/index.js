class TimeLineStore {
    constructor(simulationModel) {
        this._simulationModel = simulationModel;
        this._timeLineCanvasElement = null;
    }

    setTimeLineCanvasRef(timeLineCanvasElement) {
        this._timeLineCanvasElement = timeLineCanvasElement;
    }
}

export default TimeLineStore;
