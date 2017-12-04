import VisualModelAbstract from "../ModelAbstract";
import LineObject from "../LineObject";

export default class VisualTrajectoryModelAbstract extends VisualModelAbstract
{
    constructor(trajectory, color) {
        super();

        this.trajectory = trajectory;
        this.standardColor = color;
        this.color = color;

        this.setThreeObj(new LineObject(
            new THREE.Geometry(),
            new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors})
        ));

        this.threeObj.userData = {trajectory: trajectory};
        sim.selection.addSelectableObject(this.threeObj);
    }

    select() {
        this.color = 0xFFFFFF;
    }

    deselect() {
        this.color = this.standardColor;
    }
}