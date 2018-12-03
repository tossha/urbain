import { sim } from "./core/index";

export const loadTLE = function(noradId) {
    return sim.getModule("SolarSystem").loadTLE(sim.starSystem, noradId);
};

export const loadKSP = function() {
    return sim.loadModule("KSP");
};
