import TrajectoryAbstract from "./Abstract";
import FunctionOfEpochCustom from "../FunctionOfEpoch/Custom";
import ReferenceFrameInertialDynamic from "../ReferenceFrame/InertialDynamic";
import KeplerianEditor from "../KeplerianEditor";

export default class TrajectoryKeplerianAbstract extends TrajectoryAbstract
{
    getKeplerianObjectByEpoch(epoch) {}

    constructor(referenceFrameId) {
        super(referenceFrameId);

        let that = this;
        this.orbitalReferenceFrame = new ReferenceFrameInertialDynamic(
            new FunctionOfEpochCustom((epoch) => {
                return that.referenceFrame.getOriginStateByEpoch(epoch);
            }),
            new FunctionOfEpochCustom((epoch) => {
                return that.referenceFrame.getQuaternionByEpoch(epoch).mul(
                    that.getKeplerianObjectByEpoch(epoch).getOrbitalFrameQuaternion()
                );
            })
        );
    }

    select() {
        this.keplerianEditor = new KeplerianEditor(this, false);
        super.select();
    }

    deselect() {
        this.keplerianEditor.remove();
        delete this.keplerianEditor;
        super.deselect();
    }

    getPeriapsisVector(epoch) {
        return this.getKeplerianObjectByEpoch(epoch).getPeriapsisVector();
    }

    isEditable() {
        return false;
    }

    getStateInOwnFrameByEpoch(epoch) {
        return this.getKeplerianObjectByEpoch(epoch).getStateByEpoch(epoch);
    }
}