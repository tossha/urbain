import TrajectoryKeplerianArray from "../core/Trajectory/KeplerianArray";
import TrajectoryKeplerianPrecessingArray from "../core/Trajectory/KeplerianPrecessingArray";
import TrajectoryKeplerianBasic from "../core/Trajectory/KeplerianBasic";
import TrajectoryKeplerianPrecessing from "../core/Trajectory/KeplerianPrecessing";
import KeplerianObject from "../core/KeplerianObject";
import TrajectoryComposite from "../core/Trajectory/Composite";
import VisualTrajectoryModelPointArray from "../core/visual/TrajectoryModel/PointArray";
import VisualTrajectoryModelKeplerian from "../core/visual/TrajectoryModel/Keplerian";
import TrajectoryStaticPosition from "../core/Trajectory/StaticPosition";
import {Vector} from "../core/algebra";
import { sim } from "../core/Simulation";

export default class TrajectoryLoader
{
    static create(config) {
        let type = config.type;
        let trajectory;
        let visualModel;

        if (type === 'keplerian') {
            trajectory = this.createKeplerianBasic(config);
        } else if (type === 'keplerian_precessing') {
            trajectory = this.createKeplerianPrecessing(config);
        } else if (type === 'keplerian_array') {
            trajectory = this.createKeplerianArray(config);
        } else if (type === 'keplerian_precessing_array') {
            trajectory = this.createKeplerianPrecessingArray(config);
        } else if (type === 'composite') {
            trajectory = this.createComposite(config);
        } else if (type === 'static') {
            trajectory = this.createStatic(config);
        } else {
            const className = sim.getClass(type);
            trajectory = new className(config.data);
        }

        if (config.periodStart !== undefined) {
            trajectory.minEpoch = config.periodStart;
        }
        if (config.periodEnd !== undefined) {
            trajectory.maxEpoch = config.periodEnd;
        }

        // temporary
        if (config.rendering) {
            config.visual = config.rendering;
        }

        if (config.visual !== undefined) {
            if (config.visual.keplerianModel) {
                visualModel = new VisualTrajectoryModelKeplerian(trajectory, config.visual);
            } else if (config.visual.pointArrayModel) {
                visualModel = new VisualTrajectoryModelPointArray(trajectory, config.visual);
            } else {
                let className;
                if (config.visual.model === 'keplerian') {
                    className = VisualTrajectoryModelKeplerian;
                } else if (config.visual.model === 'pointArray') {
                    className = VisualTrajectoryModelPointArray;
                } else {
                    className = sim.getClass(config.visual.model);
                }
                visualModel = new className(trajectory, config.visual.config);
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

    static createKeplerianBasic(config) {
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
