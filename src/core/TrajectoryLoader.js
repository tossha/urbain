import TrajectoryFactory from "./Trajectory/factory";
import VisualModelFactory from "./visual/visual-model-factory";

class TrajectoryLoader {
    static create(config) {
        const type = config.type;
        const trajectory = TrajectoryFactory.createTrajectory(type, config);

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

        let visualModel;
        let selectedVisualModel;

        if (config.visual !== undefined) {
            if (config.visual.regular !== undefined) {
                visualModel = VisualModelFactory.createVisualModel(trajectory, config.visual.regular);
                selectedVisualModel = VisualModelFactory.createVisualModel(trajectory, config.visual.selected);
            } else {
                visualModel = VisualModelFactory.createVisualModel(trajectory, config.visual);
            }
        }

        if (visualModel) {
            trajectory.setVisualModel(visualModel);
        }
        if (selectedVisualModel) {
            trajectory.setSelectedVisualModel(selectedVisualModel);
        }

        return trajectory;
    }
}

export default TrajectoryLoader;
