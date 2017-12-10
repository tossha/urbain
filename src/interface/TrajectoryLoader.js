import TrajectoryKeplerianArray from "../core/Trajectory/KeplerianArray";
import TrajectoryKeplerianPrecessingArray from "../core/Trajectory/KeplerianPrecessingArray";
import TrajectoryKeplerianBasic from "../core/Trajectory/KeplerianBasic";
import TrajectoryKeplerianPrecessing from "../core/Trajectory/KeplerianPrecessing";
import KeplerianObject from "../core/KeplerianObject";
import TrajectoryComposite from "../core/Trajectory/Composite";
import VisualTrajectoryModelPointArray from "../visual/TrajectoryModel/PointArray";
import VisualTrajectoryModelKeplerian from "../visual/TrajectoryModel/Keplerian";
import TrajectoryStaticPosition from "../core/Trajectory/StaticPosition";
import {Vector} from "../algebra";
import TrajectoryVSOP87 from "../core/Trajectory/VSOP87";

export default class TrajectoryLoader
{
    static create(config) {
        let type = config.type;
        let trajectory;
        let visualModel;

        if (type === 'keplerian') {
            trajectory = this.createKeplerian(config);
        }

        if (type === 'keplerian_precessing') {
            trajectory = this.createKeplerianPrecessing(config);
        }

        if (type === 'keplerian_array') {
            trajectory = this.createKeplerianArray(config);
        }

        if (type === 'keplerian_precessing_array') {
            trajectory = this.createKeplerianPrecessingArray(config);
        }

        if (type === 'composite') {
            trajectory = this.createComposite(config);
        }

        if (type === 'static') {
            trajectory = this.createStatic(config);
        }

        if (type === 'vsop87') {
            trajectory = this.createVSOP87(config);
        }

        if (config.periodStart !== undefined) {
            trajectory.minEpoch = config.periodStart;
        }
        if (config.periodEnd !== undefined) {
            trajectory.maxEpoch = config.periodEnd;
        }

        if (config.rendering !== undefined) {
            if (config.rendering.keplerianModel) {
                visualModel = new VisualTrajectoryModelKeplerian(trajectory, config.rendering.color);
            } else if (config.rendering.pointArrayModel) {
                visualModel = new VisualTrajectoryModelPointArray(
                    trajectory,
                    config.rendering.color,
                    config.rendering.pointArrayModel
                );
            }
        }

        if (visualModel) {
            trajectory.setVisualModel(visualModel);
        }

        return trajectory;
    }

    static createComposite(config) {
        let traj = new TrajectoryComposite();
        for (const partConfig of config.data) {
            traj.addComponent(this.create(partConfig));
        }
        return traj;
    }

    static createKeplerianArray(config) {
        let traj = new TrajectoryKeplerianArray(
            config.data.referenceFrame
        );

        for (const entry of config.data.elementsArray) {
            traj.addState(this.createKeplerianObject(entry, config.data.mu));
        }
        return traj;
    }

    static createKeplerianPrecessingArray(config) {
        let traj = new TrajectoryKeplerianPrecessingArray(
            config.data.referenceFrame,
            config.data.radius,
            config.data.j2
        );

        for (const entry of config.data.elementsArray) {
            traj.addState(this.createKeplerianObject(entry, config.data.mu));
        }
        return traj;
    }

    static createKeplerian(config) {
        return new TrajectoryKeplerianBasic(
            config.data.referenceFrame,
            this.createKeplerianObject(config.data.elements)
        );
    }

    static createKeplerianPrecessing(config) {
        return new TrajectoryKeplerianPrecessing(
            config.data.referenceFrame,
            this.createKeplerianObject(config.data.elements),
            config.data.radius,
            config.data.j2
        );
    }

    static createStatic(config) {
        return new TrajectoryStaticPosition(
            config.data.referenceFrame,
            new Vector(config.data.position)
        );
    }

    static createVSOP87(config) {
        return new TrajectoryVSOP87(
            config.data.body,
            config.data.coefficients
        );
    }

    static createKeplerianObject(elements, mu) {
        return new KeplerianObject(
            elements[0], // ecc
            elements[1] / (1 - elements[0]), // sma = Rper / (1 - ecc)
            elements[2], // aop
            elements[3], // inc
            elements[4], // raan
            elements[5], // mean anomaly
            elements[6], // epoch
            mu ? mu : elements[7], // mu
            false
        );
    }
}