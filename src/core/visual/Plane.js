import * as THREE from "three";
import VisualModelAbstract from "./ModelAbstract";
import FunctionOfEpochAbstract from "../FunctionOfEpoch/Abstract";
import { sim } from "../simulation-engine";

export default class VisualPlane extends VisualModelAbstract
{
    constructor(position, quaternion, size, color, opacity) {
        super(sim);

        this._position = position;
        this._quaternion = quaternion;

        this.setThreeObj(new THREE.Mesh(
            new THREE.CircleGeometry(size, 300),
            new THREE.MeshBasicMaterial({
                color: color || 'white',
                opacity: opacity || 0.5,
                transparent: true,
                side: THREE.DoubleSide
            })
        ));
    }

    _resolve(valueOfEpoch, epoch) {
        if (valueOfEpoch instanceof FunctionOfEpochAbstract) {
            return valueOfEpoch.evaluate(epoch);
        }
        return valueOfEpoch;
    }

    getPosition(epoch) {
        return this._resolve(this._position, epoch);
    }

    getQuaternion(epoch) {
        return this._resolve(this._quaternion, epoch);
    }

    render(epoch) {
        this.threeObj.quaternion.copy(this.getQuaternion(epoch).toThreejs());
        this.setPosition(this.getPosition(epoch));
    }
}
