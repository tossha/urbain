import { sim as simulationEngine } from "../../../../core/simulation-engine";
import StarSystemLoader from "../../../../core/StarSystemLoader";
import StarSystem from "../../../../core/StarSystem";

const SOLAR_SYSTEM_NAME = "Solar System";
const SOLAR_SYSTEM_ID = "solar_system";

export default class SolarStarSystem extends StarSystem {
    constructor(tleLoader) {
        super(SOLAR_SYSTEM_ID, SOLAR_SYSTEM_NAME);
        this._tleLoader = tleLoader;
    }

    /**
     * @param {StarSystemLoaderService} starSystemLoader
     * @param onLoaded
     * @return {Promise<any>}
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

    _onSystemLoaded(starSystem) {
        StarSystemLoader.loadObjectByUrl(starSystem, "./spacecraft/voyager1.json");
        StarSystemLoader.loadObjectByUrl(starSystem, "./spacecraft/voyager2.json");
        StarSystemLoader.loadObjectByUrl(starSystem, "./spacecraft/lro.json");
        StarSystemLoader.loadObjectByUrl(starSystem, "./spacecraft/osiris-rex.json");
        StarSystemLoader.loadObjectByUrl(starSystem, "./spacecraft/parker.json");
        StarSystemLoader.loadObjectByUrl(starSystem, "./spacecraft/roadster.json");
        StarSystemLoader.loadObjectByUrl(starSystem, "./spacecraft/hayabusa2.json");

        this._tleLoader.loadTLE(starSystem, 25544); // ISS
        this._tleLoader.loadTLE(starSystem, 20580); // Hubble

        simulationEngine.time.initValues();
        simulationEngine.time.useCurrentTime();
    }
}
