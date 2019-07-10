import $ from "jquery";

export default class StarSystemLoaderService {
    fetchStarSystemConfig(starSystemFilename, onStarSystemLoad) {
        return Promise.resolve(
            $.getJSON("./star_systems/" + starSystemFilename, starSystemConfig => {
                onStarSystemLoad(starSystemConfig);
            }),
        );
    }
}
