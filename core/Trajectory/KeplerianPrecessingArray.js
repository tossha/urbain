class TrajectoryKeplerianPrecessingArray extends TrajectoryKeplerianArray
{
    constructor(starSystem, referenceFrameId, r, j2, color) {
        super(starSystem, referenceFrameId, color);

        this.r = r;
        this.j2 = j2;
    }

    approximateKeplerianObject(object1, object2, epoch) {
        return super.approximateKeplerianObject(
            object1.copy().addPrecession(this.r, this.j2, epoch),
            object2.copy().addPrecession(this.r, this.j2, epoch),
            epoch
        );
    }
}