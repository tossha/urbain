import UniverseService from "./universe-service";
import StarSystemLoaderService from "./star-system-loader-service";

export function createServices() {
    return {
        universeService: new UniverseService(),
        starSystemLoader: new StarSystemLoaderService(),
    };
}
