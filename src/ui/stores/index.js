import AppStore from "./app-store";
import StatisticsBadgeStore from "./statistics-badge-store";
import SelectedObjectMetricsStore from "./selected-object-metrics-store";
import TimeStore from "./time-store";
import TimeLineStore from "./time-line-store";
import TimeSettingsPanelStore from "../components/main-view/components/bottom-panel/components/time-settings-panel/store/time-settings-panel-store";
import { createSimulationEngine } from "../../core/simulation-engine";
import SimulationStore from "./simulation-store";
import UniverseSelectorStore from "./universe-selector-store";

/**
 * @param {AppModel} appModel
 * @return {{appStore: AppStore, statisticsBadgeStore: StatisticsBadgeStore}}
 */
export function createStores(appModel) {
    const simulationModel = appModel.simulationModel;
    const simulationEngine = createSimulationEngine(simulationModel, appModel.statisticsModel);
    const appStore = new AppStore(appModel, simulationEngine);
    const statisticsBadgeStore = new StatisticsBadgeStore(appModel.statisticsModel);
    const selectedObjectMetricsStore = new SelectedObjectMetricsStore(simulationEngine);
    const timeStore = new TimeStore(simulationModel.timeModel);
    const timeLineStore = new TimeLineStore(simulationModel);
    const timeSettingsPanelStore = new TimeSettingsPanelStore(
        simulationModel.timeModel,
        simulationModel.activeUniverse,
    );

    const simulationStore = new SimulationStore(simulationModel, simulationEngine);
    const universeSelectorStore = new UniverseSelectorStore(simulationModel);

    return {
        appStore,
        statisticsBadgeStore,
        selectedObjectMetricsStore,
        timeStore,
        timeLineStore,
        timeSettingsPanelStore,
        simulationStore,
        universeSelectorStore,
    };
}

export { AppStore };
export { MenuItemType } from "./header-store";
