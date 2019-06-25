import AppStore from "./app-store";
import StatisticsBadgeStore from "./statistics-badge-store";
import SelectedObjectMetricsStore from "./selected-object-metrics-store";
import TimeStore from "./time-store";
import TimeLineStore from "./time-line-store";
import TimeSettingsPanelStore from "../components/main-view/components/bottom-panel/components/time-settings-panel/store/time-settings-panel-store";

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
    const timeSettingsPanelStore = new TimeSettingsPanelStore(
        simulationModel.timeModel,
        simulationModel.activeUniverse,
    );

    return {
        appStore,
        statisticsBadgeStore,
        selectedObjectMetricsStore,
        timeStore,
        timeLineStore,
        timeSettingsPanelStore,
    };
}

export { AppStore };
export { MenuItemType } from "./header-store";
