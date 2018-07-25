import $ from "jquery";

import UIPanelTime from "./Panels/Time";
import UIPanelCamera from "./Panels/Camera";
import UIPanelMetrics from "./Panels/Metrics";
import UIPanelLambert from "./Panels/Lambert";
import UIPanelCreation from "./Panels/Creation";
import { sim } from "../core/Simulation";

export default class UI
{
    constructor() {
        this.timePanel     = new UIPanelTime    ($('#timePanel'),    sim.time);
        this.cameraPanel   = new UIPanelCamera  ($('#cameraPanel'),  sim.camera, sim.starSystem);
        this.metricsPanel  = new UIPanelMetrics ($('#metricsPanel'), sim.selection);
        this.creationPanel = new UIPanelCreation($('#creationPanel'));
        this.lambertPanel  = new UIPanelLambert ($('#lambertPanel'));
    }
}
