/**
 * @readonly
 * @enum {string}
 */
export const VisualModelType = {
    Keplerian: "keplerian",
    PointArray: "pointArray",
};

/**
 * @readonly
 * @enum {string}
 */
export const TrajectoryType = {
    Keplerian: "keplerian",
    KeplerianPrecessing: "keplerian_precessing",
    KeplerianArray: "keplerian_array",
    KeplerianPrecessingArray: "keplerian_precessing_array",
    Composite: "composite",
    Static: "static",
    VSOP87: "SolarSystem.TrajectoryVSOP87",
    ELP2000: "SolarSystem.TrajectoryELP2000",
};

/**
 * @readonly
 * @enum {string}
 */
export const OrientationType = {
    ConstantAxis: "constantAxis",
    IAUModel: "SolarSystem.OrientationIAUModel",
};

export const STAR_SYSTEM_BARYCENTER = 0;
