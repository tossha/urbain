import AppStore from "./app-store";
import StatisticsBadgeStore from "./statistics-badge-store";
import SelectedObjectMetricsStore from "./selected-object-metrics-store";
import TimeStore from "./time-store";
import TimeLineStore from "./time-line-store";

/**
 * @param {AppModel} appModel
 * @return {{appStore: AppStore, statisticsBadgeStore: StatisticsBadgeStore}}
 */
export function createStores(appModel) {
    const simulationModel = appModel.simulationModel;
    const appStore = new AppStore(appModel, simulationModel);
    const statisticsBadgeStore = new StatisticsBadgeStore(simulationModel);
    const selectedObjectMetricsStore = new SelectedObjectMetricsStore(simulationModel);
    const timeStore = new TimeStore(simulationModel.timeModel);
    const timeLineStore = new TimeLineStore(simulationModel);

    return {
        appStore,
        statisticsBadgeStore,
        selectedObjectMetricsStore,
        timeStore,
        timeLineStore,
    };
}

export { AppStore };
export { MenuItemType } from "./header-store";
