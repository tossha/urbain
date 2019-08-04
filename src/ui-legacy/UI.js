import $ from "jquery";

import UIPanelCamera from "./Panels/Camera";
import UIPanelMetrics from "./Panels/Metrics";
import UIPanelLambert from "./Panels/Lambert";
import UIPanelCreation from "./Panels/Creation";
import UIPanelManeuver from "./Panels/Maneuver";
import UIPanelDynamicTrajectory from "./Panels/DynamicTrajectory";

export default class UI {
    /**
     * @param {SimulationEngine} simulationEngine
     * @param {SimulationModel} simulationModel
     */
    constructor(simulationEngine, simulationModel) {
        const cameraPanel   = new UIPanelCamera  ($('#cameraPanel'), simulationEngine.camera);
        const metricsPanel  = new UIPanelMetrics ($('#metricsPanel'), simulationEngine);
        const creationPanel = new UIPanelCreation($('#creationPanel'), simulationEngine);
        this.lambertPanel   = new UIPanelLambert ($('#lambertPanel'), simulationEngine, simulationModel);
        const maneuverPanel = new UIPanelManeuver($('#maneuverPanel'), simulationEngine);

        const dynamicTrajectoryPanel = new UIPanelDynamicTrajectory($('#dynamicTrajectoryPanel'));
    }
}
