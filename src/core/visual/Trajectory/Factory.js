import { VisualModelType } from "../../constants";
import VisualTrajectoryKeplerian from "./Keplerian";
import VisualTrajectoryPointArray from "./PointArray";

export default class VisualTrajectoryFactory {
    static createFromConfig(trajectory, { model, config }) {
        switch (model) {
            case VisualModelType.Keplerian:
                return new VisualTrajectoryKeplerian(trajectory, config);
            case VisualModelType.PointArray:
                return new VisualTrajectoryPointArray(trajectory, config);
            default:
                throw new Error("This type of visual model isn't found");
        }
    }
}
