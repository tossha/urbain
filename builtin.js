
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
const TRAJECTORIES = [];
const BODIES = [];

MU[SUN]   = 132712440017.99;
MU[EARTH] = 398600.4415;
MU[MOON]  = 4902.8005821478;

const SSDATA = {
    "0": {
        type: 'point',
        name: 'Solar System barycenter',
        traj: {
            type: 'static',
            rf: {
                origin: SOLAR_SYSTEM_BARYCENTER,
                type: 0
            },
            data: [0, 0, 0]
        }
    },
    "10": {
        type: 'body',
        name: 'Sun',
        traj: {
            type: 'static',
            rf: {
                origin: 0,
                type: 0
            },
            data: [0, 0, 0]
        },
        phys: {
            mu: 132712440017.99,
            r: 695990
        },
        vis: {
            color: 'yellow',
            r: 695990
        }
    },
    "3": {
        type: 'point',
        name: 'Earth-Moon barycenter',
        traj: {
            type: 'keplerian',
            rf: {
                origin: 10,
                type: 0
            },
            data: {
                sma:   149597884.0730492,
                e:     0.01670422637889116,
                inc:   0.002082299954669842,
                aop:   290.2089532325788,
                raan:  172.7636694715336,
                ta:    357.3028478564579,
                epoch: 504921600
            }
        }
    },
    "399": {
        type: 'body',
        name: 'Earth',
        traj: {
            type: 'keplerian',
            rf: {
                origin: 3,
                type: 0
            },
            data: {
                sma:   4613.765540018721,
                e:     0.06486770007872773,
                inc:   5.073071126433605,
                aop:   20.82994497592186,
                raan:  174.6580109718808,
                ta:    166.9343758181924,
                epoch: 504921600
            }
        },
        phys: {
            mu: 398600.4415,
            r: 6378.1363
        },
        vis: {
            color: 'blue',
            r: 6378.1363
        }
    },
    "301": {
        type: 'body',
        name: 'Moon',
        traj: {
            type: 'keplerian',
            rf: {
                origin: 3,
                type: 0
            },
            data: {
                sma:   375101.7639784294,
                e:     0.06486770007872773,
                inc:   5.073071126433605,
                aop:   200.82994497592186,
                raan:  174.6580109718808,
                ta:    166.9343758181924,
                epoch: 504921600
            }
        },
        phys: {
            mu: 4902.8005821478,
            r: 1738.2
        },
        vis: {
            color: 'white',
            r: 1738.2
        }
    },
    "299": {
        type: 'body',
        name: 'Venus',
        traj: {
            type: 'keplerian',
            rf: {
                origin: 10,
                type: 0
            },
            data: {
                sma:   108208246.7862958,
                e:     0.006751663615311649,
                inc:   3.394389692813713,
                aop:   55.08742381793331,
                raan:  76.63476390664616,
                ta:    53.72929784185243,
                epoch: 504921600
            }
        },
        phys: {
            mu: 324858.59882646,
            r: 6051.9
        },
        vis: {
            color: 'brown',
            r: 6051.9
        }
    }
};