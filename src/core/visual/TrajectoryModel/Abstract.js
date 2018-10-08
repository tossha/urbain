import * as THREE from "three";

import VisualModelAbstract from "../ModelAbstract";
import LineObject from "../LineObject";
import { sim } from "../../Simulation";

export default class VisualTrajectoryModelAbstract extends VisualModelAbstract
{
    constructor(trajectory, config) {
        super();

        this.trajectory = trajectory;
        this.standardColor = config.color;
        this.color = config.color;

        this.minEpoch = (config.minEpoch !== undefined) ? config.minEpoch : (trajectory.minEpoch || null);
        this.maxEpoch = (config.maxEpoch !== undefined) ? config.maxEpoch : (trajectory.maxEpoch || null);

        this.setThreeObj(new LineObject(
            new THREE.Geometry(),
            new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors})
        ));

        this.point = new THREE.Mesh(
            new THREE.SphereGeometry(1, 8, 8),
            new THREE.MeshBasicMaterial({color: this.color})
        );
        this.scene.add(this.point);
        this.pointSize = 4;

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

    getRenderingEpoch(epoch) {
        if ((this.minEpoch !== null && epoch < this.minEpoch)
            || (this.maxEpoch !== null && epoch > this.maxEpoch)
        ) {
            return null;
        }

        if (!this.trajectory.isValidAtEpoch(epoch)) {
            if (this.trajectory.minEpoch !== null && epoch < this.trajectory.minEpoch) {
                return this.trajectory.minEpoch;
            }
            if (this.trajectory.maxEpoch !== null && epoch > this.trajectory.maxEpoch) {
                return this.trajectory.maxEpoch;
            }
        }

        return epoch;
    }

    render(epoch) {
        if (!this.trajectory.isValidAtEpoch(epoch)) {
            this.point.visible = false;
            return;
        }

        this.point.visible = true;
        this.point.position.copy(sim.getVisualCoords(this.trajectory.getPositionByEpoch(epoch)));
        const scaleKoeff = this.pointSize * this.point.position.length() * this.pixelAngleSize;
        this.point.scale.x = scaleKoeff;
        this.point.scale.y = scaleKoeff;
        this.point.scale.z = scaleKoeff;
    }

    select() {
        this.setColor(0xFFFFFF);
    }

    deselect() {
        this.setColor(this.standardColor);
    }

    setColor(color) {
        this.color = color;
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
