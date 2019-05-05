import SatelliteLookup from "./satellite-finder";

export function createServices() {
    return {
        satelliteFinder: new SatelliteLookup("/api"),
    };
}
