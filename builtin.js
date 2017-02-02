const RF_BASE = App.getReferenceFrame(SOLAR_SYSTEM_BARYCENTER, RF_TYPE_ECLIPTIC);

const TRAJECTORIES = {};
const BODIES = {};

const STARDATA = [
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
                type: RF_TYPE_ECLIPTIC
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [286.13, 0, 0],
            dec: [63.87, 0, 0],
            pm: [84.176, 14.1844, 0]
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [281.0097, -0.0328, 0],
            dec: [61.4143, -0.0049, 0],
            pm: [329.5469, 6.1385025, 0]
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [272.76, 0, 0],
            dec: [67.16, 0, 0],
            pm: [160.20, -1.4813688, 0]
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
                type: RF_TYPE_ECLIPTIC
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [0, -0.641, 0],
            dec: [90, -0.557, 0],
            pm: [190.147, 360.9856235, 0]
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [269.9949, 0.0031, 0],
            dec: [66.5392, 0.0130, 0],
            pm: [38.3213, 13.17635815, 0]
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [317.68143, -0.1061, 0],
            dec: [52.88650, -0.0609, 0],
            pm: [176.630, 350.89198226, 0]
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [268.056595, -0.006499, 0],
            dec: [64.495303, 0.002413, 0],
            pm: [284.95, 870.536, 0]
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [40.589, -0.036, 0],
            dec: [83.537, -0.004, 0],
            pm: [38.90, 810.7939024, 0]
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [257.311, 0, 0],
            dec: [-15.175, 0, 0],
            pm: [203.81, -501.1600928, 0]
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [299.36, 0, 0],
            dec: [43.46, 0, 0],
            pm: [253.18, 536.3128492, 0]
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
                type: RF_TYPE_ECLIPTIC
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [312.993, 0, 0],
            dec: [6.163, 0, 0],
            pm: [237.305, -56.3625225, 0]
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
                type: RF_TYPE_ECLIPTIC
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
        iauOrientation: {
            ra: [312.993,0, 0],
            dec: [6.163, 0, 0],
            pm: [57.305, -56.3625225, 0]
        }
    }
};

const TLEDATA = {
    "10001":{
    	name: 'ISS',
    	lines: [
    	    '1 25544U 98067A   16345.25971633  .00005580  00000-0  92357-4 0  9993',
    	    '2 25544  51.6439 260.0841 0005883 314.4887 146.0880 15.53854424 32373'
        ],
    	color: 'springgreen'
    },
    "10002":{
    	name: 'Hubble Space Telescope',
    	lines: [
    	    '1 20580U 90037B   16345.19836807  .00000608  00000-0  26678-4 0  9992',
    	    '2 20580  28.4685 176.1733 0002613 302.2358  16.6063 15.08617271261710'
        ],
    	color: 'gold'
    }
};
