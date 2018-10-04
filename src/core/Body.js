import EphemerisObject from "./EphemerisObject";

export default class Body extends EphemerisObject
{
    constructor(bodyId, type, name, data, visualModel, physicalModel, orientation) {
        super(bodyId, type, name, data);

        this.visualModel   = visualModel;    // class VisualBodyModelBasic
        this.physicalModel = physicalModel;  // class PhysicalBodyModel
        this.orientation   = orientation;    // class OrientationAbstract

        if (this.visualModel) {
            this.visualModel.setObject(this);
        }
    }

    drop() {
        if (this.visualModel) {
            this.visualModel.drop();
            delete this.visualModel;
        }
        super.drop();
    }
}
