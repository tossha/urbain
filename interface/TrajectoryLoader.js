class TrajectoryLoader
{
    static create(data) {
        let type = data.trajectory_type;

        if (type === 'keplerian_array') {
            if (data.trajectory.length !== 1) {
                return this.createKeplerianArray(data);
            }
            type = 'keplerian';
            data.trajectory = data.trajectory[0];
        }

        if (type === 'keplerian') {
            return this.createKeplerian(data);
        }
    }

    static createKeplerianArray(data) {
        let traj = new TrajectoryKeplerianArray(
            this.createFrame(data.parent),
            data.color
        );

        for (let i in data.trajectory) {
            traj.addState(this.createKeplerianObject(data.trajectory[i]));
        }
        return traj;
    }

    static createKeplerian(data) {
        return new TrajectoryKeplerianBasic(
            this.createFrame(data.parent),
            this.createKeplerianObject(data.trajectory),
            data.color
        );
    }

    static createFrame(origin) {
        return App.getReferenceFrame(RF_TYPE_ECLIPTIC, origin);
    }

    static createKeplerianObject(data) {
        return new KeplerianObject(
            data[0], // ecc
            data[1] / (1 - data[0]), // sma = Rper / (1 - ecc)
            data[2], // aop
            data[3], // inc
            data[4], // raan
            data[5], // mean anomaly
            data[6], // epoch
            data[7], // mu
            false
        );
    }
}