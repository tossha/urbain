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

    updateGeometry(points, colorMults, endingBrightness) {
        const mainColor = new THREE.Color(this.color);
        this.threeObj.geometry.dispose();
        this.threeObj.geometry = (new THREE.Geometry()).setFromPoints(points);

        for (let i = 0; i < colorMults.length; i++) {
            let curColor = (new THREE.Color()).copy(mainColor);
            const mult = endingBrightness + (1 - endingBrightness) * colorMults[i];

            this.threeObj.geometry.colors.push(
                curColor.multiplyScalar(mult)
            );
        }
    }

    select() {
        this.color = 0xFFFFFF;
    }

    deselect() {
        this.color = this.standardColor;
    }

    drop() {
        sim.selection.removeSelectableObject(this.threeObj);
        super.drop();
    }
}