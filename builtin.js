const RF_BASE = App.getReferenceFrame(SOLAR_SYSTEM_BARYCENTER, RF_TYPE_ECLIPTIC);

const BODIES = {};

const STARDATA = [
    [0, 0, 100],
    [45, 80, 50],
    [90, 90 , 100]
];

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
