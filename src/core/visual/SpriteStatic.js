import VisualSprite from "./Sprite";

export default class VisualSpriteStatic extends VisualSprite
{
    static _texture = null;
    static _textureName = null;
    static _alignVertical = 'center';
    static _alignHorizontal = 'center';

    static preloadTexture(textureLoader) {
        textureLoader.load('images/' + this._textureName, texture => {this._texture = texture});
    }

    constructor(color) {
        super(null, null, color);

        this.setAlign(this.constructor._alignVertical, this.constructor._alignHorizontal);

        if (this.constructor._texture) {
            this.setTexture(this.constructor._texture);
        } else {
            this.loadTexture('images/' + this.constructor._textureName);
        }
    }
}
