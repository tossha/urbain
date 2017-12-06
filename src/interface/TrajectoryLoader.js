import TrajectoryKeplerianArray from "../core/Trajectory/KeplerianArray";
import TrajectoryKeplerianPrecessingArray from "../core/Trajectory/KeplerianPrecessingArray";
import TrajectoryKeplerianBasic from "../core/Trajectory/KeplerianBasic";
import TrajectoryKeplerianPrecessing from "../core/Trajectory/KeplerianPrecessing";
import KeplerianObject from "../core/KeplerianObject";
import TrajectoryComposite from "../core/Trajectory/Composite";

export default class TrajectoryLoader
{
    static create(config) {
        let type = config.type;
        let result;

        if (type === 'keplerian') {
            result = this.createKeplerian(config);
        }

        if (type === 'keplerian_precessing') {
            result = this.createKeplerianPrecessing(config);
        }

        if (type === 'keplerian_array') {
            result = this.createKeplerianArray(config);
        }

        if (type === 'keplerian_precessing_array') {
            result = this.createKeplerianPrecessingArray(config);
        }

        if (type === 'composite') {
            result = this.createComposite(config);
        }

        if (config.periodStart !== undefined) {
            result.minEpoch = config.periodStart;
        }
        if (config.periodEnd !== undefined) {
            result.maxEpoch = config.periodEnd;
        }

        return result;
    }

    static createComposite(config) {
        let traj = new TrajectoryComposite(config.color);
        for (const partConfig of config.data) {
            traj.addComponent(this.create(partConfig));
        }
        traj.finalize();
        return traj;
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