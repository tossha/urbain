import { VisualModelType } from "../constants";
import VisualTrajectoryModelKeplerian from "./Trajectory/Keplerian";
import VisualTrajectoryModelPointArray from "./Trajectory/PointArray";

export default class VisualModelFactory {
    /**
     * @param trajectory
     * @param {object} config
     * @param {VisualModelType} config.model
     * @return {VisualTrajectoryModelAbstract}
     */
    static createVisualModel(trajectory, { model, config }) {
        //TODO: legacy format, will be removed
        if (config.keplerianModel) {
            return new VisualTrajectoryModelKeplerian(trajectory, config);
        } else if (config.pointArrayModel) {
            return new VisualTrajectoryModelPointArray(trajectory, config);
        }

        switch (model) {
            case VisualModelType.Keplerian:
                return new VisualTrajectoryModelKeplerian(trajectory, config);
            case VisualModelType.PointArray:
                return new VisualTrajectoryModelPointArray(trajectory, config);
            default:
                throw new Error("This type of visual model isn't found");
        }
    }
}
