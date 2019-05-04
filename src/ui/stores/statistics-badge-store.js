class StatisticsBadgeStore {
    /**
     * @param {SimulationModel} simulationModel
     */
    constructor(simulationModel) {
        this._simulationModel = simulationModel;
    }

    get isStatisticsBadgeVisible() {
        return this._simulationModel.statisticsModel.isBadgeVisible;
    }

    get statistics() {
        return this._simulationModel.statisticsModel.statistics;
    }
}

export default StatisticsBadgeStore;
