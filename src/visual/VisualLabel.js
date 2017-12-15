import VisualModelAbstract from "./ModelAbstract";

export const DEFAULT_TEXT_SETTINGS = {
    text: '',
    font: 'Arial',
    color: 'white',
    size: 20
};
export default class VisualLabel extends VisualModelAbstract {
    constructor(functionOfEpoch, parameters) {
        super();
        parameters = Object.assign({}, DEFAULT_TEXT_SETTINGS, parameters);
        this.functionOfEpoch = functionOfEpoch;
        this.canvas = document.createElement('canvas');
        let context = this.canvas.getContext('2d');
        this.canvas.height = THREE.Math.ceilPowerOfTwo(parameters.size);
        context.font = parameters.size + 'px ' + parameters.font;
        let textWidth = context.measureText(parameters.text).width;
        this.canvas.width = THREE.Math.ceilPowerOfTwo(textWidth);
        context.font = parameters.size + 'px ' + parameters.font;
        context.textAlign = 'center';
        context.fillStyle = parameters.color;
        context.fillText(parameters.text, this.canvas.width / 2, parameters.size);
        let texture = new THREE.CanvasTexture(this.canvas);
        texture.needsUpdate = true;
        let material = new THREE.SpriteMaterial({map: texture});
        this.sprite = new THREE.Sprite(material);
        this.setThreeObj(this.sprite);
    }

    render(epoch) {
        this.threeObj.position.copy(sim.getVisualCoords(this.functionOfEpoch.evaluate(epoch)));
        this.scaleKoeff = this.threeObj.position.length() * sim.raycaster.getPixelAngleSize();
        this.sprite.scale.x = this.canvas.width  * this.scaleKoeff;
        this.sprite.scale.y = this.canvas.height * this.scaleKoeff;
    }
}
