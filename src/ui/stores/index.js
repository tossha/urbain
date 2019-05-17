import AppStore from "./app-store";
import StatisticsBadgeStore from "./statistics-badge-store";
import SelectedObjectMetricsStore from "./selected-object-metrics-store";

/**
 * @param {AppModel} appModel
 * @param {SimulationModel} simulationModel
 * @return {{appStore: AppStore, statisticsBadgeStore: StatisticsBadgeStore}}
 */
export function createStores(appModel, simulationModel) {
    const appStore = new AppStore(appModel, simulationModel);
    const statisticsBadgeStore = new StatisticsBadgeStore(simulationModel);
    const selectedObjectMetricsStore = new SelectedObjectMetricsStore(simulationModel);

    return {
        appStore,
        statisticsBadgeStore,
        selectedObjectMetricsStore,
        satelliteSearchPanelStore: appStore.satelliteSearchPanelStore,
    };
}

export { AppStore };
export { MenuItemType } from "./header-store";
