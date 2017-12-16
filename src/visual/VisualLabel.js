import VisualModelAbstract from "./ModelAbstract";

export const DEFAULT_TEXT_SETTINGS = {
    text: '',
    font: 'Arial',
    color: 'white',
    size: 20,
    scalingRange: {
        from: 30000,
        to: 400000
    }
};
export default class VisualLabel extends VisualModelAbstract {
    constructor(functionOfEpoch, parameters) {
        super();
        this.parameters = Object.assign({}, DEFAULT_TEXT_SETTINGS, parameters);
        this.functionOfEpoch = functionOfEpoch;
        this.canvas = document.createElement('canvas');
        let context = this.canvas.getContext('2d');
        this.canvas.height = THREE.Math.ceilPowerOfTwo(this.parameters.size);
        context.font = this.parameters.size + 'px ' + this.parameters.font;
        let textWidth = context.measureText(this.parameters.text).width;
        this.canvas.width = THREE.Math.ceilPowerOfTwo(textWidth);
        context.font = this.parameters.size + 'px ' + this.parameters.font;
        context.textAlign = 'center';
        context.fillStyle = this.parameters.color;
        context.fillText(this.parameters.text, this.canvas.width / 2, this.parameters.size);
        let texture = new THREE.CanvasTexture(this.canvas);
        texture.needsUpdate = true;
        let material = new THREE.SpriteMaterial({map: texture});
        this.sprite = new THREE.Sprite(material);
        this.setThreeObj(this.sprite);
    }

    render(epoch) {
        this.threeObj.position.copy(sim.getVisualCoords(this.functionOfEpoch.evaluate(epoch)));
        this.scaleKoeff = this.calculateScaleKoeff(this.threeObj.position, this.parameters.scalingRange);
        this.sprite.scale.x = this.canvas.width  * this.scaleKoeff;
        this.sprite.scale.y = this.canvas.height * this.scaleKoeff;
    }

    calculateScaleKoeff(position, range) {
        if (typeof range.callback !== 'undefined') {
            return range.callback(position, range);
        }
        if (position.length() < range.from){
            return range.from * sim.raycaster.getPixelAngleSize();
        }
        if (position.length() > range.to) {
            return range.to * sim.raycaster.getPixelAngleSize();
        }
        return position.length() * sim.raycaster.getPixelAngleSize();
    }
}
