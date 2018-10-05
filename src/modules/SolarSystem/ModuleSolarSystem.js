import Module from "../../core/Module";
import { sim } from "../../core/Simulation";
import Events from "../../core/Events";
import StarSystemLoader from "../../interface/StarSystemLoader";
import TrajectoryELP2000 from "./Trajectory/ELP2000";
import TrajectoryVSOP87 from "./Trajectory/VSOP87";

export default class ModuleSolarSystem extends Module
{
    init() {
        sim.loadStarSystem('solar_system.json');
        Events.addListener(Events.STAR_SYSTEM_LOADED, (event) => {
            StarSystemLoader.loadObjectByUrl(event.detail.starSystem, './spacecraft/voyager1.json');
            StarSystemLoader.loadObjectByUrl(event.detail.starSystem, './spacecraft/voyager2.json');
            StarSystemLoader.loadObjectByUrl(event.detail.starSystem, './spacecraft/lro.json');

            this.loadTLE(event.detail.starSystem, 25544); // ISS
            this.loadTLE(event.detail.starSystem, 20580); // Hubble
        });

        this._addClass('TrajectoryVSOP87', TrajectoryVSOP87);
        this._addClass('TrajectoryELP2000', TrajectoryELP2000);
    }

    loadTLE(starSystem, noradId) {
        const path = Math.floor(noradId / 1000);
        StarSystemLoader.loadObjectByUrl(starSystem, './spacecraft/' + path + '/' + noradId + '.json.gz');
    };
}
