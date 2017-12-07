import VisualModelAbstract from "./ModelAbstract";
import {Events} from "../core/Events";
import {Vector} from "../algebra";

export default class VisualReferenceFrame extends VisualModelAbstract
{
    constructor(referenceFrame) {
        super();
        
        this.referenceFrame = referenceFrame;
        this.setThreeObj(new THREE.AxesHelper(1));
    }

    render(epoch) {
        const position = sim.getVisualCoords(this.referenceFrame.getOriginPositionByEpoch(epoch));
        const scale = position.length() / 10;
        this.threeObj.position.copy(position);
        this.threeObj.quaternion.copy(
            this.referenceFrame.getQuaternionByEpoch(epoch).toThreejs()
        );
        this.threeObj.scale.set(scale, scale, scale);
    }

    remove() {
        this.scene.remove(this.threeObj);
        this.threeObj.geometry.dispose();
        this.threeObj.remove();
        document.removeEventListener(Events.RENDER, this.renderListener);
    }
}