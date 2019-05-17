import UIPanel from "../Panel";
import Events from "../../core/Events";
import TrajectoryDynamic from "../../core/Trajectory/Dynamic";

export default class UIPanelDynamicTrajectory extends UIPanel {
    constructor(panelDom) {
        super(panelDom);

        Events.addListener(Events.SELECT, this.handleSelect);
        Events.addListener(Events.DESELECT, this.handleDeselect);

        this.jqDump = this.jqDom.find('#dump');
        this.jqDump.click(() => {
            const json = JSON.stringify(this.trajectory.dump());
            prompt('Copy this text:', json);
            console.log(json);
        });

        this.hide();
    }

    handleSelect = ({ detail }) => {
        const object = detail.object;

        if (!(object.trajectory instanceof TrajectoryDynamic)) {
            return;
        }

        this.trajectory = object.trajectory;

        this.show();
    };

    handleDeselect = () => {
        delete this.trajectory;
        this.hide();
    };
}
