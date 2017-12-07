import VisualModelAbstract from "./ModelAbstract";

export default class VisualVector extends VisualModelAbstract
{
    constructor(vector, origin) {
        super();
        this.origin = origin;
        this.setThreeObj(new THREE.ArrowHelper(
            (new THREE.Vector3()).fromArray(vector.unit()),
            sim.getVisualCoords(this.origin),
            vector.mag
        ));
    }

    render(epoch) {
        this.threeObj.position.copy(sim.getVisualCoords(this.origin));
    }
}