import Module from "../../core/Module";
import { sim } from "../../core/simulation-engine";


export default class ModuleKSP extends Module {
    loadStarSystem() {
        sim.loadStarSystem('ksp.json', () => {
            sim.forceEpoch(0);
            sim.time.updateScaleType();
            sim.ui.lambertPanel.useCurrentTime();
        });
    }
}
