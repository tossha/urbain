import VisualTrajectoryKeplerian from "./Keplerian";
import VisualTrajectoryPointArray from "./PointArray";
import { sim } from "../../simulation-engine";

export default class VisualTrajectoryFactory
{
    static createFromConfig(trajectory, config) {
        let className;
        if (config.visual.model === 'keplerian') {
            className = VisualTrajectoryKeplerian;
        } else if (config.visual.model === 'pointArray') {
            className = VisualTrajectoryPointArray;
        } else {
            className = sim.getClass(config.visual.model);
        }
        return new className(trajectory, config.visual.config);
    }
}
