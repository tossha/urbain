import UniverseService from "./universe-service";

export function createServices() {
    return {
        universeService: new UniverseService(),
    };
}
