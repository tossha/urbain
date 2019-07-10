const DEFAULT_UNIVERSE_NAME = "solar-system";

class UniverseService {
    /**
     * @return {string}
     */
    getDefaultUniverseId() {
        const universeModuleName = DEFAULT_UNIVERSE_NAME; // TODO: Get universe name from local storage or from server

        return universeModuleName;
    }

    /**
     * @param {string} universeModuleName
     * @param options
     * @return {Promise<Universe>}
     */
    async loadUniverseModule(universeModuleName, options) {
        const universe = (await import(`../../universes/${universeModuleName}/${universeModuleName}-universe`)).default;

        return new universe(options);
    }
}

export default UniverseService;
