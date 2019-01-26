import SatelliteFinder from "./satellite-finder/satellite-finder";

export function createServices() {
    return {
        satelliteFinder: new SatelliteFinder("/api"),
    };
}
