import { sim as simulationEngine, sim } from "../../../core/simulation-engine";
import StarSystemLoader from "../../../interface/StarSystemLoader";
import StarSystem from "../../../core/StarSystem";

export default class DefaultKspStarSystem extends StarSystem {
    constructor() {
        super("ksp", "KSP System");
    }

    load(starSystemLoader, onLoaded) {
        simulationEngine.stopSimulation();

        return starSystemLoader.fetchStarSystemConfig(this.fileName, starSystemConfig => {
            simulationEngine.loadStarSystem(this, starSystem => {
                StarSystemLoader.loadFromConfig(starSystem, starSystemConfig);

                this._onSystemLoaded(starSystem);
                onLoaded && onLoaded(starSystem);
            });
        });
    }

    _onSystemLoaded() {
        sim.forceEpoch(0);
        sim.time.updateScaleType();
        sim.ui.lambertPanel.useCurrentTime();
    }
}
