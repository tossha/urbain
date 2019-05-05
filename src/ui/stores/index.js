import AppStore from "./app-store";
import StatisticsBadgeStore from "./statistics-badge-store";

/**
 * @param {AppModel} appModel
 * @param {SimulationModel} simulationModel
 * @return {{appStore: AppStore, statisticsBadgeStore: StatisticsBadgeStore}}
 */
export function createStores(appModel, simulationModel) {
    const appStore = new AppStore(appModel, simulationModel);
    const statisticsBadgeStore = new StatisticsBadgeStore(simulationModel);

    return {
        appStore,
        statisticsBadgeStore,
        satelliteSearchPanelStore: appStore.satelliteSearchPanelStore,
    };
}

export { AppStore };
export { MenuItemType } from "./header-store";
