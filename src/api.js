import { sim } from "./core/index";
import StarSystemLoader from "./interface/StarSystemLoader";

export const loadTLE = function(noradId) {
    StarSystemLoader.loadTLE(sim.starSystem, noradId);
};
