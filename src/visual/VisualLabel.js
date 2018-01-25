import VisualModelAbstract from "./ModelAbstract";

export const DEFAULT_TEXT_SETTINGS = {
    text: '',
    font: 'Arial',
    color: 'white',
    size: 20,
    objectSize: 0,
    marginFromObject: 20,
    scaling: {
        range: {
            from: 30000,
            to: 700000,
        },
        callback: 'range'
    },
    scalingFunctions: {
        alwaysVisible: (position) => position.length() * sim.raycaster.getPixelAngleSize(),
        range: (position, range) => {
            if (position.length() < range.from) {
                return range.from * sim.raycaster.getPixelAngleSize();
            }
            if (position.length() > range.to) {
                return range.to * sim.raycaster.getPixelAngleSize();
            }
            return position.length() * sim.raycaster.getPixelAngleSize();
        }
    },
};
export default class VisualLabel extends VisualModelAbstract {
    constructor(functionOfEpoch, parameters) {
        super();
        this.parameters = Object.assign({}, DEFAULT_TEXT_SETTINGS, parameters);
        this.functionOfEpoch = functionOfEpoch;
        this.canvas = document.createElement('canvas');
        let context = this.canvas.getContext('2d');
        context.font = this.parameters.size + 'px ' + this.parameters.font;
        let canvasWidth = context.measureText(this.parameters.text).width;
        let canvasHeight = this.parameters.size + this.parameters.marginFromObject;
        this.canvas.height = THREE.Math.ceilPowerOfTwo(canvasHeight);
        this.canvas.width = THREE.Math.ceilPowerOfTwo(canvasWidth);
        context.font = this.parameters.size + 'px ' + this.parameters.font;
        context.fillStyle = this.parameters.color;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText(this.parameters.text,
            this.canvas.width / 2,
            (this.canvas.height - this.parameters.size) / 2
        );
        let texture = new THREE.CanvasTexture(this.canvas);
        texture.needsUpdate = true;
        let material = new THREE.SpriteMaterial({map: texture});
        this.sprite = new THREE.Sprite(material);
        this.setThreeObj(this.sprite);
    }

    render(epoch) {
        this.scaleKoeff = this.calculateScaleKoeff(this.threeObj.position, this.parameters.scaling);
        this.sprite.scale.x = this.canvas.width  * this.scaleKoeff;
        this.sprite.scale.y = this.canvas.height * this.scaleKoeff;
        this.threeObj.position.copy(sim.getVisualCoords(
            this.functionOfEpoch.evaluate(epoch)
            .add_(
                sim.camera.getTopDirection(epoch)
                .mul_(this.parameters.objectSize)
            )
            .add_(
                sim.camera.getTopDirection(epoch)
                .mul_((this.parameters.size / 2 + this.parameters.marginFromObject)*this.scaleKoeff)
            )
        ));
    }

    calculateScaleKoeff(position, scaling) {
        if (typeof scaling.callback === 'string') {
            return this.parameters.scalingFunctions[scaling.callback](position, scaling.range);
        }
        return scaling.callback(position, scaling.range);
    }
}
