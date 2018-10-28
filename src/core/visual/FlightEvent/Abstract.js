
import VisualSprite from "../Sprite";
import FunctionOfEpochCustom from "../../FunctionOfEpoch/Custom";
import {RF_BASE_OBJ} from "../../ReferenceFrame/Factory";
import { sim } from '../../Simulation';

export default class VisualFlightEventAbstract extends VisualSprite
{
    static _texture = null;
    static _textureName = null;
    static _alignVertical = 'center';
    static _alignHorizontal = 'center';

    static preloadTexture() {
        sim.textureLoader.load('images/' + this._textureName, texture => {this._texture = texture});
    }

    constructor(trajectory, flightEvent, color) {
        super(null, null, color);

        this.setAlign(this.constructor._alignVertical, this.constructor._alignHorizontal);

        this._flightEvent = flightEvent;
        this._trajectory = trajectory;

        this.setPositionOfEpoch(new FunctionOfEpochCustom(epoch => {
            if (epoch > this._flightEvent.epoch) {
                return false;
            }
            return this._trajectory.getPositionByEpoch(this._flightEvent.epoch, RF_BASE_OBJ, epoch)
        }));
        if (this.constructor._texture) {
            this.setTexture(this.constructor._texture);
        } else {
            this.loadTexture('images/' + this.constructor._textureName);
        }
    }
}
