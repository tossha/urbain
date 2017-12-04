class TrajectoryLoader
{
    static create(config) {
        let type = config.type;

        if (type === 'keplerian') {
            return this.createKeplerian(config);
        }

        if (type === 'keplerian_precessing') {
            return this.createKeplerianPrecessing(config);
        }

        if (type === 'keplerian_array') {
            return this.createKeplerianArray(config);
        }

        if (type === 'keplerian_precessing_array') {
            return this.createKeplerianPrecessingArray(config);
        }
    }

    static createKeplerianArray(config) {
        let traj = new TrajectoryKeplerianArray(
            config.data.referenceFrame,
            config.color
        );

        for (const entry of config.data.elementsArray) {
            traj.addState(this.createKeplerianObject(entry));
        }
        return traj;
    }

    static createKeplerianPrecessingArray(config) {
        let traj = new TrajectoryKeplerianPrecessingArray(
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

    static createKeplerian(config) {
        return new TrajectoryKeplerianBasic(
            config.data.referenceFrame,
            this.createKeplerianObject(config.data.elements),
            config.color
        );
    }

    static createKeplerianPrecessing(config) {
        return new TrajectoryKeplerianPrecessing(
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