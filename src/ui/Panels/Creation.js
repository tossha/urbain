import UIPanel from "../Panel";
import EphemerisObject from "../../core/EphemerisObject";
import TrajectoryKeplerianBasic from "../../core/Trajectory/KeplerianBasic";
import ReferenceFrameFactory, {ReferenceFrame} from "../../core/ReferenceFrame/Factory";
import VisualTrajectoryModelKeplerian from "../../visual/TrajectoryModel/Keplerian";
import KeplerianObject from "../../core/KeplerianObject";

export default class UIPanelCreation extends UIPanel {
    constructor(panelDom) {
        super(panelDom);

        this.jqPause = this.jqDom.find('#createOrbit');
        this.jqPause.click(() => {
            const center = sim.camera.orbitingPoint;
            const object = sim.starSystem.getObject(center);
            if (!object.physicalModel) {
                return;
            }
            const sma = object.physicalModel.radius * 1.1;
            const id = -11000000 - sim.starSystem.created;
            sim.starSystem.created += 1;
            let ephObject = new EphemerisObject(id, EphemerisObject.TYPE_UNKNOWN, "Created #" + sim.starSystem.created);
            let traj = new TrajectoryKeplerianBasic(
                ReferenceFrameFactory.buildId(center, ReferenceFrame.INERTIAL_BODY_EQUATORIAL),
                new KeplerianObject(
                    0, sma, 0, Math.PI / 2, 0, 0, sim.currentEpoch, object.physicalModel.mu
                )
            );
            traj.setVisualModel(new VisualTrajectoryModelKeplerian(traj, {color: 'yellow'}));

            ephObject.setTrajectory(traj);
            sim.starSystem.addObject(id, ephObject);
            sim.starSystem.addTrajectory(id, traj);
            sim.selection.forceSelection(traj);
        });
    }
}