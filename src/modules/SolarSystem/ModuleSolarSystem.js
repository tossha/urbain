import Module from "../../core/Module";
import { sim } from "../../core/Simulation";
import Events from "../../core/Events";
import StarSystemLoader from "../../interface/StarSystemLoader";
import TrajectoryELP2000 from "./Trajectory/ELP2000";
import TrajectoryVSOP87 from "./Trajectory/VSOP87";
import OrientationIAUModel from "./Orientation/IAUModel";

export default class ModuleSolarSystem extends Module
{
    init() {
        sim.loadStarSystem('solar_system.json');

        this._systemLoadedListener = this._onSystemLoaded.bind(this);
        Events.addListener(Events.STAR_SYSTEM_LOADED, this._systemLoadedListener);

        this._addClass('TrajectoryVSOP87', TrajectoryVSOP87);
        this._addClass('TrajectoryELP2000', TrajectoryELP2000);
        this._addClass('OrientationIAUModel', OrientationIAUModel);
    }

    _onSystemLoaded(event) {
        StarSystemLoader.loadObjectByUrl(event.detail.starSystem, './spacecraft/voyager1.json');
        StarSystemLoader.loadObjectByUrl(event.detail.starSystem, './spacecraft/voyager2.json');
        StarSystemLoader.loadObjectByUrl(event.detail.starSystem, './spacecraft/lro.json');

        this.loadTLE(event.detail.starSystem, 25544); // ISS
        this.loadTLE(event.detail.starSystem, 20580); // Hubble

        Events.removeListener(Events.STAR_SYSTEM_LOADED, this._systemLoadedListener);
    }

    loadTLE(starSystem, noradId) {
        const path = Math.floor(noradId / 1000);
        StarSystemLoader.loadObjectByUrl(starSystem, './spacecraft/' + path + '/' + noradId + '.json.gz');
    };

    /*
   *---------------  CONSTANTS  ---------------
    */
    static SUN = 10;
    /*
   *---------------  BARYCENTERS  ---------------
    */
    static MERCURY_BARYCENTER = 1;
    static VENUS_BARYCENTER   = 2;
    static EARTH_BARYCENTER   = 3;
    static MARS_BARYCENTER    = 4;
    static JUPITER_BARYCENTER = 5;
    static SATURN_BARYCENTER  = 6;
    static URANUS_BARYCENTER  = 7;
    static NEPTUNE_BARYCENTER = 8;
    static PLUTO_BARYCENTER   = 9;
    /*
   *---------------  PLANETS  ---------------
    */
    static MERCURY = 199;
    static VENUS   = 299;
    static EARTH   = 399;
    static MARS    = 499;
    static JUPITER = 599;
    static SATURN  = 699;
    static URANUS  = 799;
    static NEPTUNE = 899;
    static PLUTO   = 999;
    /*
   *---------------  SATELLITES  ---------------
    */
    static MOON      = 301;  // Earth
    static IO        = 501;  // Jupiter
    static EUROPA    = 502;
    static GANYMEDE  = 503;
    static CALLISTO  = 504;
    static MIMAS     = 601;  // Saturn
    static ENCELADUS = 602;
    static TITAN     = 606;
    static TRITON    = 801;  // Neptune
    static CHARON    = 901;  // Pluto
}
