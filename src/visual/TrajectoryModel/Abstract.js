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

        this.point = new THREE.Mesh(
            new THREE.SphereGeometry(1, 8, 8),
            new THREE.MeshBasicMaterial({color: color})
        );
        this.scene.add(this.point);
        this.pointSize = 3;

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

    render(epoch) {
        if (this.trajectory.minEpoch !== null && this.trajectory.minEpoch !== false) {
            if (epoch < this.trajectory.minEpoch) {
                this.point.visible = false;
                return;
            }
        }
        if (this.trajectory.maxEpoch !== null && this.trajectory.maxEpoch !== false) {
            if (epoch > this.trajectory.maxEpoch) {
                this.point.visible = false;
                return;
            }
        }

        const pos = this.trajectory.getPositionByEpoch(epoch);

        if (!pos) {
            this.point.visible = false;
            return;
        }

        this.point.visible = true;
        this.point.position.copy(sim.getVisualCoords(pos));
        const scaleKoeff = this.pointSize * this.point.position.length() * sim.raycaster.getPixelAngleSize();
        this.point.scale.x = scaleKoeff;
        this.point.scale.y = scaleKoeff;
        this.point.scale.z = scaleKoeff;
    }

    select() {
        this.color = 0xFFFFFF;
        this.point.material.color.set(this.color);
        this.point.material.needsUpdate = true;
    }

    deselect() {
        this.color = this.standardColor;
        this.point.material.color.set(this.color);
        this.point.material.needsUpdate = true;
    }

    drop() {
        sim.selection.removeSelectableObject(this.threeObj);

        this.scene.remove(this.point);
        if (this.point.geometry) {
            this.point.geometry.dispose();
        }
        if (this.point.material) {
            this.point.material.dispose();
        }
        delete this.point;

        super.drop();
    }
}