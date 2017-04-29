class TrajectoryKeplerianPrecessing extends TrajectoryKeplerianBasic
{
    constructor(referenceFrame, keplerianObject, r, j2, color) {
        super(referenceFrame, keplerianObject, color);

        this.keplerianObject = keplerianObject;
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
