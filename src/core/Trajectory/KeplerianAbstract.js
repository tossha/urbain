import TrajectoryAbstract from "./Abstract";
import FunctionOfEpochCustom from "../FunctionOfEpoch/Custom";
import ReferenceFrameInertialDynamic from "../ReferenceFrame/InertialDynamic";
import KeplerianEditor from "../KeplerianEditor";

export default class TrajectoryKeplerianAbstract extends TrajectoryAbstract
{
    constructor(referenceFrameId) {
        super();
        this.setReferenceFrame(referenceFrameId);

        this.orbitalReferenceFrame = new ReferenceFrameInertialDynamic(
            new FunctionOfEpochCustom((epoch) => {
                return this.referenceFrame.getOriginStateByEpoch(epoch);
            }),
            new FunctionOfEpochCustom((epoch) => {
                const quat = this.referenceFrame.getQuaternionByEpoch(epoch);
                const ko = this.getKeplerianObjectByEpoch(epoch);
                return (quat && ko) ? quat.mul_(ko.getOrbitalFrameQuaternion()) : null;
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
        const ko = this.getKeplerianObjectByEpoch(epoch);
        return ko ? ko.getPeriapsisVector() : null;
    }

    getStateInOwnFrameByEpoch(epoch) {
        const ko = this.getKeplerianObjectByEpoch(epoch);
        return ko ? ko.getStateByEpoch(epoch) : null;
    }
}