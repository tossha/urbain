import { sim } from "./core/index";

export const loadTLE = function(noradId) {
    sim.getModule('solarSystem').loadTLE(sim.starSystem, noradId);
};
