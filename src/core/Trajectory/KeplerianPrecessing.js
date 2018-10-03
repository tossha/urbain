import TrajectoryKeplerianBasic from "./KeplerianBasic";
import KeplerianObject from "../KeplerianObject";

export default class TrajectoryKeplerianPrecessing extends TrajectoryKeplerianBasic
{
    constructor(referenceFrameId, keplerianObject, r, j2) {
        super(referenceFrameId, keplerianObject);

        this.r = r;
        this.j2 = j2;
    }

    getKeplerianObjectByEpoch(epoch, referenceFrameOrId) {
        this.validateEpoch(epoch);
        return this._transformKeplerianObject(
            this.keplerianObject.addPrecession(this.r, this.j2, epoch),
            referenceFrameOrId
        );
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
