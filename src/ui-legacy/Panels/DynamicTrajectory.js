import UIPanel from "../Panel";
import Events from "../../core/Events";
import EphemerisObject from "../../core/EphemerisObject";
import TrajectoryKeplerianBasic from "../../core/Trajectory/KeplerianBasic";
import ReferenceFrameFactory, {ReferenceFrame} from "../../core/ReferenceFrame/Factory";
import VisualTrajectoryModelKeplerian from "../../core/visual/Trajectory/Keplerian";
import KeplerianObject from "../../core/KeplerianObject";
import TrajectoryDynamic from "../../core/Trajectory/Dynamic";
import { sim } from "../../core/Simulation";
import VisualTrajectoryDynamic from "../../core/visual/Trajectory/Dynamic";

export default class UIPanelDynamicTrajectory extends UIPanel {
    constructor(panelDom) {
        super(panelDom);

        document.addEventListener(Events.SELECT, this.handleSelect.bind(this));
        document.addEventListener(Events.DESELECT, this.handleDeselect.bind(this));

        this.jqDump = this.jqDom.find('#dump');
        this.jqDump.click(() => {
            const json = JSON.stringify(this.trajectory.dump());
            prompt('Copy this text:', json);
            console.log(json);
        });

        this.hide();
    }

    handleSelect(event) {
        const object = event.detail.object;

        if (!(object.trajectory instanceof TrajectoryDynamic)) {
            return;
        }

        this.trajectory = object.trajectory;

        this.show();
    }

    handleDeselect() {
        delete this.trajectory;
        this.hide();
    }
}
