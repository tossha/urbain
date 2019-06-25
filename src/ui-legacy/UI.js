import $ from "jquery";

import UIPanelTime from "./Panels/Time";
import UIPanelCamera from "./Panels/Camera";
import UIPanelMetrics from "./Panels/Metrics";
import UIPanelLambert from "./Panels/Lambert";
import UIPanelCreation from "./Panels/Creation";
import UIPanelManeuver from "./Panels/Maneuver";
import UIPanelDynamicTrajectory from "./Panels/DynamicTrajectory";

export default class UI {
    /**
     * @param {SimulationEngine} simulationEngine
     */
    constructor(simulationEngine) {
        const timePanel     = new UIPanelTime    ($('#timePanel'), simulationEngine);
        const cameraPanel   = new UIPanelCamera  ($('#cameraPanel'), simulationEngine.camera);
        const metricsPanel  = new UIPanelMetrics ($('#metricsPanel'), simulationEngine);
        const creationPanel = new UIPanelCreation($('#creationPanel'), simulationEngine);
        this.lambertPanel   = new UIPanelLambert ($('#lambertPanel'), simulationEngine);
        const maneuverPanel = new UIPanelManeuver($('#maneuverPanel'), simulationEngine);

        const dynamicTrajectoryPanel = new UIPanelDynamicTrajectory($('#dynamicTrajectoryPanel'));
    }
}
