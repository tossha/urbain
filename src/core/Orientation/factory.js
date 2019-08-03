import OrientationConstantAxis from "./ConstantAxis";
import OrientationIAUModel
    from "../../universes/solar-system/star-systems/default-solar-star-system/orientation/orientation-iau-model";
import { OrientationType } from "../constants";

class OrientationFactory {
    /**
     * @param {OrientationType} type
     * @param config
     * @return {OrientationAbstract}
     */
    static createOrientation(type, config) {
        switch (type) {
            case OrientationType.ConstantAxis:
                return new OrientationConstantAxis(config);

            case OrientationType.IAUModel:
                return new OrientationIAUModel(config);

            default:
                throw new Error("This type of orientation isn't found");
        }
    }
}

export default OrientationFactory;
