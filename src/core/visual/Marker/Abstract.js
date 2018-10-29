
import VisualSpriteStatic from "../SpriteStatic";

export default class VisualMarkerAbstract extends VisualSpriteStatic
{
    constructor(parentThreeObj, color) {
        super(color);
        this._parent = parentThreeObj;
        this.threeObj && this._parent.add(this.threeObj);
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
    }

    setPosition(pos) {
        this.threeObj && this.threeObj.position.copy(pos);
    }
}