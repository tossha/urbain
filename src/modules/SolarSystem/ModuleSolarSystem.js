import Module from "../../core/Module";
import { sim } from "../../core/Simulation";
import StarSystemLoader from "../../interface/StarSystemLoader";
import TrajectoryELP2000 from "./Trajectory/ELP2000";
import TrajectoryVSOP87 from "./Trajectory/VSOP87";
import OrientationIAUModel from "./Orientation/IAUModel";

export default class ModuleSolarSystem extends Module {
    init() {
        this._addClass("TrajectoryVSOP87", TrajectoryVSOP87);
        this._addClass("TrajectoryELP2000", TrajectoryELP2000);
        this._addClass("OrientationIAUModel", OrientationIAUModel);
    }

    loadStarSystem(alias, callback) {
        return sim.loadStarSystem("solar_system.json", starSystem => {
            this._onSystemLoaded(starSystem);
            callback && callback(starSystem);
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

        this.loadTLE(starSystem, 25544); // ISS
        this.loadTLE(starSystem, 20580); // Hubble

        sim.time.initValues();
        sim.time.useCurrentTime();
    }

    /**
     * @param starSystem
     * @param {Number} noradId
     * @return {Promise<any>}
     */
    loadTLE(starSystem, noradId) {
        const path = Math.floor(noradId / 1000);
        return StarSystemLoader.loadObjectByUrl(starSystem, "./spacecraft/" + path + "/" + noradId + ".json.gz");
    }

    /*
   *---------------  CONSTANTS  ---------------
    */
    static SUN = 10;
    /*
   *---------------  BARYCENTERS  ---------------
    */
    static MERCURY_BARYCENTER = 1;
    static VENUS_BARYCENTER = 2;
    static EARTH_BARYCENTER = 3;
    static MARS_BARYCENTER = 4;
    static JUPITER_BARYCENTER = 5;
    static SATURN_BARYCENTER = 6;
    static URANUS_BARYCENTER = 7;
    static NEPTUNE_BARYCENTER = 8;
    static PLUTO_BARYCENTER = 9;
    /*
   *---------------  PLANETS  ---------------
    */
    static MERCURY = 199;
    static VENUS = 299;
    static EARTH = 399;
    static MARS = 499;
    static JUPITER = 599;
    static SATURN = 699;
    static URANUS = 799;
    static NEPTUNE = 899;
    static PLUTO = 999;
    /*
   *---------------  SATELLITES  ---------------
    */
    static MOON = 301; // Earth
    static IO = 501; // Jupiter
    static EUROPA = 502;
    static GANYMEDE = 503;
    static CALLISTO = 504;
    static MIMAS = 601; // Saturn
    static ENCELADUS = 602;
    static TITAN = 606;
    static TRITON = 801; // Neptune
    static CHARON = 901; // Pluto
}
