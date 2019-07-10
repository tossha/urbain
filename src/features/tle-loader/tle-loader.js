import StarSystemLoader from "../../interface/StarSystemLoader";

class TleLoader {
    /**
     * @param starSystem
     * @param {Number} noradId
     * @return {Promise<any>}
     */
    loadTLE(starSystem, noradId) {
        const path = Math.floor(noradId / 1000);
        return StarSystemLoader.loadObjectByUrl(starSystem, "./spacecraft/" + path + "/" + noradId + ".json.gz");
    }
}

export default TleLoader;
