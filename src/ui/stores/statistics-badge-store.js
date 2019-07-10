class StatisticsBadgeStore {
    /**
     * @param {StatisticsModel} statisticsModel
     */
    constructor(statisticsModel) {
        this._statisticsModel = statisticsModel;
    }

    get isStatisticsBadgeVisible() {
        return this._statisticsModel.isBadgeVisible;
    }

    get statistics() {
        return this._statisticsModel.statistics;
    }
}

export default StatisticsBadgeStore;
