import UIPanelTime from "./Panels/Time";
import UIPanelCamera from "./Panels/Camera";
import UIPanelMetrics from "./Panels/Metrics";
import UIPanelLambert from "./Panels/Lambert";

export default class UI
{
    constructor() {
        this.timePanel    = new UIPanelTime   ($('#timePanel'),    sim.time);
        this.cameraPanel  = new UIPanelCamera ($('#cameraPanel'),  sim.camera, sim.starSystem);
        this.metricsPanel = new UIPanelMetrics($('#metricsPanel'), sim.selection);
        this.lambertPanel = new UIPanelLambert($('#lambertPanel'));
    }
}
