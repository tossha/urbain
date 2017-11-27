class Body extends EphemerisObject
{
    constructor(bodyId, name, visualModel, physicalModel, orientation) {
        super(bodyId, name);

        this.visualModel   = visualModel;    // class VisualBodyModelBasic
        this.physicalModel = physicalModel;  // class PhysicalBodyModel
        this.orientation   = orientation;    // class OrientationAbstract

        this.visualModel.body = this;
    }
}