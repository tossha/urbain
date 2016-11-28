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

const TRAJECTORIES = {};
const BODIES = {};

STARDATA = [
    [0, 0, 100],
    [45, 80, 50],
    [90, 90 , 100]
];

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
                origin: SOLAR_SYSTEM_BARYCENTER,
                type: 0
            },
            data: [0, 0, 0]
        },
        phys: {
            mu: 132712440017.99,
            r: 695990
        },
        visual: {
            lightColor: 0xFFFFFF,
            lightIntensity: 1.5,
            color: 'yellow',
            r: 695990,
            texture: 'SunTexture.jpg'
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    },
    "199": {
        type: 'body',
        name: 'Mercury',
        traj: {
            type: 'keplerian',
            color: 'azure',
            rf: {
                origin: SUN,
                type: 0
            },
            data: {
                mu:    132712440017.99,   // MU[sun]
                sma:   57909058.7229379,
                e:     0.2056276354377539,
                inc:   7.004033584449934,
                aop:   29.16864397274399,
                raan:  48.31072095174862,
                ta:    315.6336996863121,
                epoch: 504921600
            }
        },
        phys: {
            mu: 22032.09,
            r: 2440
        },
        visual: {
            color: 'azure',
            r: 2440,
            texture: 'MercuryTexture.jpg'
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    },
    "299": {
        type: 'body',
        name: 'Venus',
        traj: {
            type: 'keplerian',
            color: 'orange',
            rf: {
                origin: SUN,
                type: 0
            },
            data: {
                mu:    132712440017.99,   // MU[sun]
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
        visual: {
            color: 'orange',
            r: 6051.9,
            texture: 'VenusTexture.jpg'
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    },
    "3": {
        type: 'point',
        name: 'Earth-Moon barycenter',
        traj: {
            type: 'keplerian',
            color: 'lightblue',
            rf: {
                origin: SUN,
                type: 0
            },
            data: {
                mu:    132712440017.99,   // MU[sun]
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
            color: 'blue',
            rf: {
                origin: EARTH_BARYCENTER,
                type: 0
            },
            data: {
                mu:    0.7238334181449901,  // MU[moon]^3 / (MU[earth] + MU[moon])^2
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
        visual: {
            color: 'blue',
            r: 6378.1363,
            texture: 'EarthTexture.jpg'
        },
        orientation: {
            epoch: 0,
            axisX: 0.4087561108170719,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00007292123516990375
        }
    },
    "301": {
        type: 'body',
        name: 'Moon',
        traj: {
            type: 'keplerian',
            color: 'white',
            rf: {
                origin: EARTH_BARYCENTER,
                type: 0
            },
            data: {
                mu:    388972.8321930768,  // MU[earth]^3 / (MU[earth] + MU[moon])^2
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
        visual: {
            color: 'white',
            r: 1738.2,
            texture: 'MoonTexture.jpg'
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    },
    "499": {
        type: 'body',
        name: 'Mars',
        traj: {
            type: 'keplerian',
            color: 'red',
            rf: {
                origin: SUN,
                type: 0
            },
            data: {
                mu:    132712440017.99,   // MU[sun]
                sma:   227954932.2062293,
                e:     0.0933649439485778,
                inc:   1.848381570486811,
                aop:   286.6256700730665,
                raan:  49.50845266825914,
                ta:    198.183429577232,
                epoch: 504921600
            }
        },
        phys: {
            mu: 42828.3,
            r: 3389.5
        },
        visual: {
            color: 'red',
            r: 3389.5,
            texture: 'MarsTexture.jpg'
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    },
    "599": {
        type: 'body',
        name: 'Jupiter',
        traj: {
            type: 'keplerian',
            color: 'burlywood',
            rf: {
                origin: SUN,
                type: 0
            },
            data: {
                mu:    132712440017.99,   // MU[sun]
                sma:   778009698.6788862,
                e:     0.04911235964163412,
                inc:   1.303987369321965,
                aop:   273.4973247139014,
                raan:  100.5349737039174,
                ta:    148.9342217328035,
                epoch: 504921600
            }
        },
        phys: {
            mu: 126686511,
            r: 69911
        },
        visual: {
            color: 'burlywood',
            r: 69911,
            texture: 'JupiterTexture.jpg'
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    },
    "699": {
        type: 'body',
        name: 'Saturn',
        traj: {
            type: 'keplerian',
            color: 'sandybrown',
            rf: {
                origin: SUN,
                type: 0
            },
            data: {
                mu:    132712440017.99,   // MU[sun]
                sma:   1429692875.223513,
                e:     0.05339875895697828,
                inc:   2.485625304505188,
                aop:   340.4087405991758,
                raan:  113.6260806406088,
                ta:    154.1626903865896,
                epoch: 504921600
            }
        },
        phys: {
            mu: 37931207.8,
            r: 58232
        },
        visual: {
            color: 'sandybrown',
            r: 58232
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    },
    "799": {
        type: 'body',
        name: 'Uranus',
        traj: {
            type: 'keplerian',
            color: 'lightskyblue',
            rf: {
                origin: SUN,
                type: 0
            },
            data: {
                mu:    132712440017.99,   // MU[sun]
                sma:   2863675676.119915,
                e:     0.04972749244539291,
                inc:   0.7708226612915536,
                aop:   97.42634585879861,
                raan:  74.09826491838813,
                ta:    207.6317030170638,
                epoch: 504921600
            }
        },
        phys: {
            mu: 5793966,
            r: 25362
        },
        visual: {
            color: 'lightskyblue',
            r: 25362
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    },
    "899": {
        type: 'body',
        name: 'Neptune',
        traj: {
            type: 'keplerian',
            color: 'steelblue',
            rf: {
                origin: SUN,
                type: 0
            },
            data: {
                mu:    132712440017.99,   // MU[sun]
                sma:   4485133910.71173,
                e:     0.007540825004513026,
                inc:   1.767521844875323,
                aop:   292.129060084985,
                raan:  131.7410091231907,
                ta:    275.0581311484224,
                epoch: 504921600
            }
        },
        phys: {
            mu: 6835107,
            r: 24624
        },
        visual: {
            color: 'steelblue',
            r: 24624
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    },
    "9": {
        type: 'point',
        name: 'Pluto-Charon barycenter',
        traj: {
            type: 'keplerian',
            color: 'tan',
            rf: {
                origin: SUN,
                type: 0
            },
            data: {
                mu:    132712440017.99,   // MU[sun]
                sma:   5912707133.068872,
                e:     0.2509333210606892,
                inc:   17.1566429342319,
                aop:   113.490020495739,
                raan:  110.2897178551833,
                ta:    60.96007004432298,
                epoch: 504921600
            }
        }
    },
    "999": {
        type: 'body',
        name: 'Pluto',
        traj: {
            type: 'keplerian',
            color: 'tan',
            rf: {
                origin: PLUTO_BARYCENTER,
                type: 0
            },
            data: {
                mu:    1.126007850945504,   // MU[charon]^3 / (MU[pluto] + MU[charon])^2
                sma:   2060.112718687493,
                e:     0.03606432327165093,
                inc:   112.896229982432,
                aop:   303.9198212964989,
                raan:  227.4017803001296,
                ta:    179.9638849485035,
                epoch: 504921600
            }
        },
        phys: {
            mu: 872.4,
            r: 1195
        },
        visual: {
            color: 'tan',
            r: 1195
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    },
    "901": {
        type: 'body',
        name: 'Charon',
        traj: {
            type: 'keplerian',
            color: 'rosybrown',
            rf: {
                origin: PLUTO_BARYCENTER,
                type: 0
            },
            data: {
                mu:    698.9254936721327,   // MU[pluto]^3 / (MU[pluto] + MU[charon])^2
                sma:   17428.23653079901,
                e:     0.00203618279589123,
                inc:   112.896229982432,
                aop:   128.0404284152844,
                raan:  227.4017803001296,
                ta:    175.8520053526391,
                epoch: 504921600
            }
        },
        phys: {
            mu: 102.271,
            r: 605
        },
        visual: {
            color: 'rosybrown',
            r: 605
        },
        orientation: {
            epoch: 0,
            axisX: 0,
            axisY: 0,
            axisZ: 0,
            angVel: 0.00000
        }
    }
};

const TLEDATA = {
	"-1":{
		type:'point',
		name:'SCD 1',
		lineOne:'1 22490U 93009B   16329.89700470  .00000229  00000-0  13141-4 0  9991',
		lineTwo:'2 22490  24.9691 121.8480 0043027 338.6352 155.7290 14.44465961255757'
	}
};