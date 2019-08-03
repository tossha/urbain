export const UniverseRegistry = {
    SolarSystem: {
        id: "solar-system",
        name: "Solar System",
        moduleName: "solar-system",
    },
    Ksp: {
        id: "ksp",
        name: "KSP",
        moduleName: "ksp",
    },
};

UniverseRegistry.allValues = Object.keys(UniverseRegistry).map(key => UniverseRegistry[key]);

export function getModuleNameById(id) {
    const universe = UniverseRegistry.allValues.find(universe => universe.id === id);

    if (!universe) {
        throw new Error(`Universe with id "${id}" not found`);
    }

    return universe.moduleName;
}

export const SATELLITE_SEARCH_MODEL_NAME = "SatelliteSearchModel";
export const TLE_LOADER = "TleLoader";
