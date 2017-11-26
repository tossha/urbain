class Body extends EphemerisObject
{
    constructor(starSystem, bodyId, name, trajectory, visualModel, physicalModel, orientation) {
        super(starSystem, bodyId, name, trajectory);

        this.visualModel   = visualModel;    // class VisualBodyModelBasic
        this.physicalModel = physicalModel;  // class PhysicalBodyModel
        this.orientation   = orientation;    // class OrientationAbstract

        this.visualModel.body = this;
    }
}