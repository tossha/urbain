import VisualModelAbstract from "../ModelAbstract";
import VisualLabel, {DEFAULT_TEXT_SETTINGS} from "../VisualLabel";
import FunctionOfEpochObjectPosition from "../../core/FunctionOfEpoch/ObjectPosition";
import {RF_BASE} from "../../core/ReferenceFrame/Factory";
import {Events} from "../../core/Events";
import EphemerisObject from "../../core/EphemerisObject";

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
            new VisualLabel(new FunctionOfEpochObjectPosition(this.body.id, RF_BASE), {
                text: this.body.name,
                objectSize: this.shape.getMaxDimension() / 2,
                scaling:
                           this.body.type === EphemerisObject.TYPE_STAR
                        || this.body.type === EphemerisObject.TYPE_PLANET
                    ?
                        {callback: 'alwaysVisible'}
                    :
                           this.body.type === EphemerisObject.TYPE_PLANETOID
                        || this.body.type === EphemerisObject.TYPE_SATELLITE
                    ?
                        {
                            callback: 'range',
                            range: {
                                from: 10 * this.shape.getMaxDimension(),
                                to: 1000 * this.shape.getMaxDimension()
                            }
                        }
                    :
                        DEFAULT_TEXT_SETTINGS.scaling
            });
        });
    }

    getMaterial(parameters) {
        return new THREE.MeshStandardMaterial(parameters);
    }

    render(epoch) {
        this.threeObj.position.copy(sim.getVisualCoords(this.body.getPositionByEpoch(epoch)));
        this.threeObj.quaternion.copy(
            this.body.orientation.getQuaternionByEpoch(epoch).toThreejs()
        );
    }
}