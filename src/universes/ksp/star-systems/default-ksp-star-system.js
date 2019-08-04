import { sim as simulationEngine } from "../../../core/simulation-engine";
import StarSystemLoader from "../../../core/StarSystemLoader";
import StarSystem from "../../../core/StarSystem";

export default class DefaultKspStarSystem extends StarSystem {
    constructor() {
        super("ksp", "KSP System");
    }

    /**
     * @param starSystemLoader
     * @param onLoaded
     * @returns {Promise}
     */
    load(starSystemLoader, onLoaded) {
        return starSystemLoader.fetchStarSystemConfig(this.fileName, starSystemConfig => {
            simulationEngine.loadStarSystem(this, starSystem => {
                StarSystemLoader.loadFromConfig(starSystem, starSystemConfig);

                this._onSystemLoaded(starSystem);
                onLoaded && onLoaded(starSystem);
            });
        });
    }

    _onSystemLoaded() {
        simulationEngine.forceEpoch(0);
        simulationEngine.time.updateScaleType();
        simulationEngine.ui.lambertPanel.useCurrentTime();
    }
}
