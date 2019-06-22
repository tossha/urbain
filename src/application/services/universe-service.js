const DEFAULT_UNIVERSE_NAME = "solar-system";

class UniverseService {
    /**
     * @return {Promise<Universe>}
     */
    async getDefaultUniverse() {
        const universeModuleName = DEFAULT_UNIVERSE_NAME; // TODO: Get universe name from local storage or from server

        return this.loadUniverse(universeModuleName);
    }

    /**
     * @param {string} universeModuleName
     * @return {Promise<Universe>}
     */
    async loadUniverse(universeModuleName) {
        const universe = await import(`../../universes/${universeModuleName}/${universeModuleName}-universe`);

        return new universe.default();
    }
}

export default UniverseService;
