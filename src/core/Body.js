import EphemerisObject from "./EphemerisObject";
import { sim } from "./Simulation";

export default class Body extends EphemerisObject
{
    constructor(bodyId, type, parentSoiId, name, visualModel, physicalModel, orientation) {
        super(bodyId, type, name);

        this.visualModel   = visualModel;    // class VisualBodyModelBasic
        this.physicalModel = physicalModel;  // class PhysicalBodyModel
        this.orientation   = orientation;    // class OrientationAbstract
        this.parentSoiId   = parentSoiId;

        if (this.visualModel) {
            this.visualModel.setObject(this);
        }
    }

    getSoiRadius(epoch) {
        const parent = sim.starSystem.getObject(this.parentSoiId);
        const muCoeff = this.physicalModel.mu / parent.physicalModel.mu;
        const dist = this.getPositionByEpoch(epoch).sub_(parent.getPositionByEpoch(epoch)).mag;

        return dist * Math.pow(muCoeff, 2/5);
    }

    drop() {
        if (this.visualModel) {
            this.visualModel.drop();
            delete this.visualModel;
        }
        super.drop();
    }
}
