import Events from "../Events";
import { sim } from "../Simulation";

export default class VisualModelAbstract
{
    constructor() {
        this.threeObj = null;
        this.scene = sim.scene;
    }

    setThreeObj(obj) {
        this.threeObj = obj;
        this.scene.add(this.threeObj);
        this.renderListener = this._onRender.bind(this);
        document.addEventListener(Events.RENDER, this.renderListener);
    }

    setPosition(simCoords) {
        if (simCoords) {
            this.threeObj.visible = true;
            this.threeObj.position.copy(sim.getVisualCoords(simCoords));
        } else {
            this.threeObj.visible = false;
        }
    }

    get pixelAngleSize() {
        return sim.raycaster.getPixelAngleSize();
    }

    _onRender(event) {
        try {
            this.render(event.detail.epoch);
        } catch (e) {
            // console.log('Error', e);
            this.threeObj.visible = false;
        }
    }

    render(epoch) {}

    drop() {
        if (this.threeObj) {
            this.scene.remove(this.threeObj);
            this.threeObj.traverse(object => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            });
            delete this.threeObj;
        }
        this.renderListener && document.removeEventListener(Events.RENDER, this.renderListener);
    }
}

VisualModelAbstract.texturePath = 'texture/';
