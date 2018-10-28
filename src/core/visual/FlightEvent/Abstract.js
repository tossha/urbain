
import VisualSpriteStatic from "../SpriteStatic";
import FunctionOfEpochCustom from "../../FunctionOfEpoch/Custom";
import {RF_BASE_OBJ} from "../../ReferenceFrame/Factory";

export default class VisualFlightEventAbstract extends VisualSpriteStatic
{
    constructor(trajectory, flightEvent, color) {
        super(color);

        this._flightEvent = flightEvent;
        this._trajectory = trajectory;

        this.setPositionOfEpoch(new FunctionOfEpochCustom(epoch => {
            if (epoch > this._flightEvent.epoch) {
                return false;
            }
            return this._trajectory.getPositionByEpoch(this._flightEvent.epoch, RF_BASE_OBJ, epoch)
        }));
    }
}
