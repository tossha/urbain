class TrajectoryKeplerianPrecessing extends TrajectoryKeplerianBasic
{
    constructor(starSystem, referenceFrameId, keplerianObject, r, j2, color) {
        super(starSystem, referenceFrameId, keplerianObject, color);

        this.r = r;
        this.j2 = j2;
    }

    getKeplerianObjectByEpoch(epoch) {
        return this.keplerianObject.addPrecession(this.r, this.j2, epoch);
    }

    static createFromState(referenceFrame, state, mu, r, j2, epoch, color) {
        return new TrajectoryKeplerianPrecessing(
            referenceFrame,
            KeplerianObject.createFromState(state, mu, epoch),
            r,
            j2,
            color
        );
    }
}
