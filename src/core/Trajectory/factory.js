import { TrajectoryType } from "../constants";
import KeplerianObject from "../KeplerianObject";
import TrajectoryKeplerianBasic from "./KeplerianBasic";
import TrajectoryKeplerianPrecessing from "./KeplerianPrecessing";
import TrajectoryKeplerianArray from "./KeplerianArray";
import TrajectoryKeplerianPrecessingArray from "./KeplerianPrecessingArray";
import TrajectoryComposite from "./Composite";
import TrajectoryStaticPosition from "./StaticPosition";
import TrajectoryVSOP87
    from "../../universes/solar-system/star-systems/default-solar-star-system/trajectory/trajectory-VSOP87";
import TrajectoryELP2000
    from "../../universes/solar-system/star-systems/default-solar-star-system/trajectory/trajectory-elp2000";
import TrajectoryLoader from "../TrajectoryLoader";

import { Vector } from "../algebra";

class TrajectoryFactory {
    static createTrajectory(type, config) {
        switch (type) {
            case TrajectoryType.Keplerian:
                return createKeplerianBasic(config);
            case TrajectoryType.KeplerianPrecessing:
                return createKeplerianPrecessing(config);
            case TrajectoryType.KeplerianArray:
                return createKeplerianArray(config);
            case TrajectoryType.KeplerianPrecessingArray:
                return createKeplerianPrecessingArray(config);
            case TrajectoryType.Composite:
                return createComposite(config);
            case TrajectoryType.Static:
                return createStatic(config);
            case TrajectoryType.VSOP87:
                return new TrajectoryVSOP87(config.data);
            case TrajectoryType.ELP2000:
                return new TrajectoryELP2000(config.data);
            default:
                throw new Error("This type of Trajectory isn't found");
        }
    }
}

function createKeplerianBasic(config) {
    return new TrajectoryKeplerianBasic(
        config.data.referenceFrame,
        createKeplerianObject(config.data.elements)
    );
}

function createKeplerianPrecessing(config) {
    return new TrajectoryKeplerianPrecessing(
        config.data.referenceFrame,
        createKeplerianObject(config.data.elements),
        config.data.radius,
        config.data.j2
    );
}

function createKeplerianArray(config) {
    const trajectory = new TrajectoryKeplerianArray(
        config.data.referenceFrame
    );

    for (const entry of config.data.elementsArray) {
        trajectory.addState(createKeplerianObject(entry, config.data.mu));
    }

    return trajectory;
}

function createKeplerianPrecessingArray(config) {
    const trajectory = new TrajectoryKeplerianPrecessingArray(
        config.data.referenceFrame,
        config.data.radius,
        config.data.j2
    );

    for (const entry of config.data.elementsArray) {
        trajectory.addState(createKeplerianObject(entry, config.data.mu));
    }

    return trajectory;
}

function createComposite(config) {
    const trajectory = new TrajectoryComposite();

    for (const partConfig of config.data) {
        trajectory.addComponent(TrajectoryLoader.create(partConfig));
    }

    return trajectory;
}

function createStatic(config) {
    return new TrajectoryStaticPosition(
        config.data.referenceFrame,
        new Vector(config.data.position)
    );
}

function createKeplerianObject(elements, mu) {
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

export default TrajectoryFactory;
