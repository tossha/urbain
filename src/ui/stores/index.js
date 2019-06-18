import AppStore from "./app-store";
import StatisticsBadgeStore from "./statistics-badge-store";
import SelectedObjectMetricsStore from "./selected-object-metrics-store";
import TimeStore from "./time-store";

/**
 * @param {AppModel} appModel
 * @param {SimulationModel} simulationModel
 * @return {{appStore: AppStore, statisticsBadgeStore: StatisticsBadgeStore}}
 */
export function createStores(appModel, simulationModel) {
    const appStore = new AppStore(appModel, simulationModel);
    const statisticsBadgeStore = new StatisticsBadgeStore(simulationModel);
    const selectedObjectMetricsStore = new SelectedObjectMetricsStore(simulationModel);
    const timeStore = new TimeStore(simulationModel.timeModel);

    return {
        appStore,
        statisticsBadgeStore,
        selectedObjectMetricsStore,
        satelliteSearchPanelStore: appStore.satelliteSearchPanelStore,
        timeStore,
    };
}

export { AppStore };
export { MenuItemType } from "./header-store";
