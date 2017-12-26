import {Events} from "../core/Events";

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
        this.render(event.detail.epoch);
    }

    render(epoch) {}

    drop() {
        if (this.threeObj) {
            this.scene.remove(this.threeObj);
            if (this.threeObj.geometry) {
                this.threeObj.geometry.dispose();
            }
            if (this.threeObj.material) {
                this.threeObj.material.dispose();
            }
            delete this.threeObj;
        }
        document.removeEventListener(Events.RENDER, this.renderListener);
    }
}

VisualModelAbstract.texturePath = 'texture/';