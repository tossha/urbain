import { sim } from "./core/index";

/**
 * @param {number} noradId
 * @return {Promise<any>}
 */
export function loadTLE(noradId) {
    return sim.getModule("SolarSystem").loadTLE(sim.starSystem, noradId);
}

/**
 * @return {Promise<T|never>}
 */
export function loadKSP() {
    return sim.loadModule("KSP");
}
