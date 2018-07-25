import * as THREE from "three";

import VisualModelAbstract from "../ModelAbstract";
import VisualLabel from "../VisualLabel";
import Events from "../../core/Events";
import EphemerisObject from "../../core/EphemerisObject";
import FunctionOfEpochCustom from "../../core/FunctionOfEpoch/Custom";
import { sim } from "../../core/Simulation";

export default class VisualBodyModelAbstract extends VisualModelAbstract
{
    constructor(shape, color) {
        super();

        this.shape = shape;   // class VisualShapeAbstract
        this.color = color;
        this.body = null; // class Body

        this.setThreeObj(this.getThreeObj());
        this.threeObj.add(new THREE.AxesHelper(shape.radius * 2));
    }

    getThreeObj() {
        return new THREE.Mesh(
            this.shape.getThreeGeometry(),
            this.getMaterial({color: this.color, wireframe: true})
        );
    }

    setObject(obj) {
        this.body = obj;
        document.addEventListener(Events.INIT_DONE, () => {
            this.label = new VisualLabel(
                new FunctionOfEpochCustom((epoch) => {
                    return obj.getPositionByEpoch(epoch).add_(sim.camera.getTopDirection(epoch).mul_(this.shape.getMaxDimension() / 2));
                }),
                {
                    text: this.body.name,
                    margin: 0.3,
                    scaling: (this.body.type === EphemerisObject.TYPE_STAR
                            || this.body.type === EphemerisObject.TYPE_PLANET)
                        ? {callback: 'alwaysVisible'}
                        : (this.body.type === EphemerisObject.TYPE_PLANETOID
                            || this.body.type === EphemerisObject.TYPE_SATELLITE)
                            ? {
                                callback: 'range',
                                range: {
                                    from: 5 * this.shape.getMaxDimension(),
                                    to: 1000 * this.shape.getMaxDimension()
                                }
                            }
                            : VisualLabel.DEFAULT_SETTINGS.scaling
                }
            );
        });
    }

    getMaterial(parameters) {
        return new THREE.MeshStandardMaterial(parameters);
    }

    drop() {
        if (this.label) {
            this.label.drop();
        }

        super.drop();
    }

    render(epoch) {
        if (this.label) {
            this.label.visible = sim.settings.ui.showBodyLabels;
        }
        this.threeObj.position.copy(sim.getVisualCoords(this.body.getPositionByEpoch(epoch)));
        this.threeObj.quaternion.copy(
            this.body.orientation.getQuaternionByEpoch(epoch).toThreejs()
        );
    }
}
