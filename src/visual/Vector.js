import VisualModelAbstract from "./ModelAbstract";

export default class VisualVector extends VisualModelAbstract
{
    constructor(vector, origin) {
        super();
        this.origin = origin;
        this.setThreeObj(new THREE.ArrowHelper(
            (new THREE.Vector3()).fromArray(vector.unit()),
            (new THREE.Vector3()).fromArray(sim.getVisualCoords(this.origin)),
            vector.mag
        ));
    }

    render(epoch) {
        this.threeObj.position.fromArray(sim.getVisualCoords(this.origin));
    }
}