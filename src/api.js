import { sim } from "./core/index";

export const loadTLE = function(noradId) {
    console.log(noradId);
    sim.getModule("SolarSystem").loadTLE(sim.starSystem, noradId);
};

export const loadKSP = function() {
    sim.loadModule("KSP");
};
