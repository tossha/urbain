
import VisualSpriteStatic from "../SpriteStatic";

export default class VisualMarkerAbstract extends VisualSpriteStatic
{
    constructor(parentThreeObj, color) {
        super(color);
        this._parent = parentThreeObj;
        this.threeObj && this._parent.add(this.threeObj);
        this._isEnabled = false;
        this.hide();
    }

    /**
     * Redefining base method and not subscribing to RENDER event
     * because this object is intended to be controlled by parent
     * @param threeObj
     */
    setThreeObj(threeObj) {
        this.threeObj = threeObj;
        this._parent && this._parent.add(this.threeObj);
        if (this._isHidden || !this._isEnabled)
            this.threeObj.visible = false;
    }

    setPosition(pos) {
        this.threeObj && this.threeObj.position.copy(pos);
    }

    enable() {
        this._isEnabled = true;
        if (!this._isHidden) {
            this.threeObj.visible = true;
        }
    }

    disable() {
        this._isEnabled = false;
        this.threeObj.visible = false;
    }

    show() {
        super.show();
        if (!this._isEnabled) {
            this.threeObj.visible = false;
        }
    }
}