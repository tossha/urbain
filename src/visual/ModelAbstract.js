import Events from "../core/Events";
import { sim } from "../core/Simulation";

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

    _onRender(event) {
        try {
            this.render(event.detail.epoch);
        } catch (e) {
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
        document.removeEventListener(Events.RENDER, this.renderListener);
    }
}

VisualModelAbstract.texturePath = 'texture/';
