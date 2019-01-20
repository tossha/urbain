import { satelliteTransformer } from "./transformers/satellite-transformer";

class Satellite {
    constructor(satelliteRawData) {
        Object.assign(this, satelliteTransformer(satelliteRawData), {});
    }
}

export default Satellite;
