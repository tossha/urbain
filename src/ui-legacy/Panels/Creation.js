import UIPanel from "../Panel";
import EphemerisObject from "../../core/EphemerisObject";
import TrajectoryKeplerianBasic from "../../core/Trajectory/KeplerianBasic";
import ReferenceFrameFactory, {ReferenceFrame} from "../../core/ReferenceFrame/Factory";
import VisualTrajectoryModelKeplerian from "../../core/visual/Trajectory/Keplerian";
import KeplerianObject from "../../core/KeplerianObject";
import TrajectoryDynamic from "../../core/Trajectory/Dynamic";
import { sim } from "../../core/Simulation";
import VisualTrajectoryDynamic from "../../core/visual/Trajectory/Dynamic";

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
            const sma = object.physicalModel.radius * 2;
            const id = -11000000 - sim.starSystem.created;
            sim.starSystem.created += 1;

            let traj = new TrajectoryKeplerianBasic(
                ReferenceFrameFactory.buildId(center, ReferenceFrame.INERTIAL_BODY_EQUATORIAL),
                new KeplerianObject(
                    0.2, sma, Math.PI / 6, Math.PI / 3, Math.PI / 6, 0, sim.currentEpoch, object.physicalModel.mu
                )
            );
            traj.setVisualModel(new VisualTrajectoryModelKeplerian(traj, {color: 'yellow'}));
            traj.minEpoch = false;
            traj.maxEpoch = false;

            const propagatorClass = sim.getPropagator('patchedConics');
            let pTraj = new TrajectoryDynamic(new propagatorClass());
            pTraj.setVisualModel(new VisualTrajectoryDynamic(pTraj, {color: 'yellow'}));
            pTraj.addComponent(traj);

            let ephObject = new EphemerisObject(id, EphemerisObject.TYPE_UNKNOWN, "Created #" + sim.starSystem.created);
            ephObject.setTrajectory(pTraj);
            sim.starSystem.addObject(id, ephObject);
            sim.selection.forceSelection(ephObject);

            pTraj.propagate(traj.epoch);
        });
    }
}
