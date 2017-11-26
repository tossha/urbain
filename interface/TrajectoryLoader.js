class TrajectoryLoader
{
    static create(starSystem, config) {
        let type = config.type;

        if (type === 'keplerian') {
            return this.createKeplerian(starSystem, config);
        }

        if (type === 'keplerian_precessing') {
            return this.createKeplerianPrecessing(starSystem, config);
        }

        if (type === 'keplerian_array') {
            return this.createKeplerianArray(starSystem, config);
        }

        if (type === 'keplerian_precessing_array') {
            return this.createKeplerianPrecessingArray(starSystem, config);
        }
    }

    static createKeplerianArray(starSystem, config) {
        let traj = new TrajectoryKeplerianArray(
            starSystem,
            config.data.referenceFrame,
            config.color
        );

        for (const entry of config.data.elementsArray) {
            traj.addState(this.createKeplerianObject(entry));
        }
        return traj;
    }

    static createKeplerianPrecessingArray(starSystem, config) {
        let traj = new TrajectoryKeplerianPrecessingArray(
            starSystem,
            config.data.referenceFrame,
            config.data.radius,
            config.data.j2,
            config.color
        );

        for (const entry of config.data.elementsArray) {
            traj.addState(this.createKeplerianObject(entry));
        }
        return traj;
    }

    static createKeplerian(starSystem, config) {
        return new TrajectoryKeplerianBasic(
            starSystem,
            config.data.referenceFrame,
            this.createKeplerianObject(config.data.elements),
            config.color
        );
    }

    static createKeplerianPrecessing(starSystem, config) {
        return new TrajectoryKeplerianPrecessing(
            starSystem,
            config.data.referenceFrame,
            this.createKeplerianObject(config.data.elements),
            config.data.radius,
            config.data.j2,
            config.color
        );
    }

    static createKeplerianObject(elements) {
        return new KeplerianObject(
            elements[0], // ecc
            elements[1] / (1 - elements[0]), // sma = Rper / (1 - ecc)
            elements[2], // aop
            elements[3], // inc
            elements[4], // raan
            elements[5], // mean anomaly
            elements[6], // epoch
            elements[7], // mu
            false
        );
    }
}