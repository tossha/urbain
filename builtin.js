
const RF_BASE = new ReferenceFrame(SOLAR_SYSTEM_BARYCENTER, RF_TYPE_INERTIAL);
const RF_SUN = new ReferenceFrame(SUN, RF_TYPE_INERTIAL);
const RF_MERCURY_B = new ReferenceFrame(MERCURY_BARYCENTER, RF_TYPE_INERTIAL);
const RF_VENUS_B = new ReferenceFrame(VENUS_BARYCENTER, RF_TYPE_INERTIAL);
const RF_EARTH_B = new ReferenceFrame(EARTH_BARYCENTER, RF_TYPE_INERTIAL);
const RF_MARS_B = new ReferenceFrame(MARS_BARYCENTER, RF_TYPE_INERTIAL);
const RF_JUPITER_B = new ReferenceFrame(JUPITER_BARYCENTER, RF_TYPE_INERTIAL);
const RF_SATURN_B = new ReferenceFrame(SATURN_BARYCENTER, RF_TYPE_INERTIAL);
const RF_URANUS_B = new ReferenceFrame(URANUS_BARYCENTER, RF_TYPE_INERTIAL);
const RF_NEPTUNE_B = new ReferenceFrame(NEPTUNE_BARYCENTER, RF_TYPE_INERTIAL);
const RF_PLUTO_B = new ReferenceFrame(PLUTO_BARYCENTER, RF_TYPE_INERTIAL);
const RF_MERCURY = new ReferenceFrame(MERCURY, RF_TYPE_INERTIAL);
const RF_VENUS = new ReferenceFrame(VENUS, RF_TYPE_INERTIAL);
const RF_EARTH = new ReferenceFrame(EARTH, RF_TYPE_INERTIAL);
const RF_MARS = new ReferenceFrame(MARS, RF_TYPE_INERTIAL);
const RF_JUPITER = new ReferenceFrame(JUPITER, RF_TYPE_INERTIAL);
const RF_SATURN = new ReferenceFrame(SATURN, RF_TYPE_INERTIAL);
const RF_URANUS = new ReferenceFrame(URANUS, RF_TYPE_INERTIAL);
const RF_NEPTUNE = new ReferenceFrame(NEPTUNE, RF_TYPE_INERTIAL);
const RF_PLUTO = new ReferenceFrame(PLUTO, RF_TYPE_INERTIAL);

const MU = [];

MU[SUN] = 1;


const TRAJECTORIES = [];

TRAJECTORIES[EARTH_BARYCENTER] = new TrajectoryKeplerianOrbit(
    RF_BASE,    // reference frame
    MU[SUN],    // mu
    149598261,  // sma
    0.01671123, // e
    0,          // inc
    deg2rad(348.73936),  // raan
    deg2rad(114.20783),  // aop
    0,          // m0
    0,          // epoch
    'blue'      // color
);

TRAJECTORIES[EARTH] = new TrajectoryStaticPosition(
    RF_EARTH_B, // reference frame
    ZERO_VECTOR
);
