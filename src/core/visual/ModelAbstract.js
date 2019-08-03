import Events from "../Events";

export default class VisualModelAbstract {
    /**
     * @param {SimulationEngine} simulationEngine
     */
    constructor(simulationEngine) {
        this._sim = simulationEngine;
        this._isHidden = false;
        this.threeObj = null;
        this.scene = this._sim.scene;
    }

    setThreeObj(obj) {
        this.threeObj = obj;
        this.scene.add(this.threeObj);
        this.renderListener = this._onRender.bind(this);
        if (this._isHidden) {
            this.threeObj.visible = false;
        } else {
            document.addEventListener(Events.RENDER, this.renderListener);
        }
    }

    setPosition(simCoords) {
        if (simCoords) {
            this.threeObj.visible = true;
            this.threeObj.position.copy(this._sim.getVisualCoords(simCoords));
        } else {
            this.threeObj.visible = false;
        }
    }

    get pixelAngleSize() {
        return this._sim.raycaster.getPixelAngleSize();
    }

    _onRender(event) {
        try {
            this.render(event.detail.epoch);
        } catch (e) {
            // console.log('Error', e);
            this.threeObj.visible = false;
        }
    }

    hide() {
        this._isHidden = true;
        this.renderListener && document.removeEventListener(Events.RENDER, this.renderListener);
        if (this.threeObj)
            this.threeObj.visible = false;
    }

    show() {
        this._isHidden = false;
        this.renderListener && document.addEventListener(Events.RENDER, this.renderListener);
        if (this.threeObj)
            this.threeObj.visible = true;
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
