import Stats from "stats.js";
import { action, computed, observable } from "mobx";

function createStatsBadge() {
    const statsBadge = new Stats();
    statsBadge.dom.classList.add("stats-badge");

    return statsBadge;
}

class StatisticsModel {
    constructor() {
        this.statistics = createStatsBadge();
    }

    updateStatistics() {
        if (this.isBadgeVisible) {
            this.statistics.update();
        }
    }

    @observable
    _isBadgeVisible = false;

    @action
    toggleBadge(show) {
        this._isBadgeVisible = show === undefined ? !this._isBadgeVisible : show;
    }

    @computed
    get isBadgeVisible() {
        return this._isBadgeVisible;
    }
}

export default StatisticsModel;
