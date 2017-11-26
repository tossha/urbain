class Body extends EphemerisObject
{
    constructor(bodyId, name, trajectory, visualModel, physicalModel, orientation) {
        super(bodyId, name, trajectory);

        this.visualModel   = visualModel;    // class VisualBodyModelBasic
        this.physicalModel = physicalModel;  // class PhysicalBodyModel
        this.orientation   = orientation;    // class OrientationAbstract

        this.visualModel.body = this;
    }
}