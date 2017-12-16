import TrajectoryKeplerianArray from "./KeplerianArray";

export default class TrajectoryKeplerianPrecessingArray extends TrajectoryKeplerianArray
{
    constructor(referenceFrameId, r, j2) {
        super(referenceFrameId);
        this.r = r;
        this.j2 = j2;
    }

    approximateKeplerianObject(object1, object2, epoch) {
        let obj1 = object1.copy();
        let obj2 = object2.copy();
        obj1.raan += obj1.getNodalPrecessionByEpoch(this.r, this.j2, epoch);
        obj2.raan += obj2.getNodalPrecessionByEpoch(this.r, this.j2, epoch);
        return super.approximateKeplerianObject(
            obj1,
            obj2,
            epoch
        );
    }
}