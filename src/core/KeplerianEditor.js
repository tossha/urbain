import {Events} from "./Events";
import FunctionOfEpochCustom from "./FunctionOfEpoch/Custom";
import {Quaternion, Vector} from "../algebra";
import HelperAngle from "../visual/HelperAngle";

export default class KeplerianEditor
{
    constructor(trajectory, isEditMode) {
        this.isEditMode = isEditMode;
        this.trajectory = trajectory;
        if (sim.ui.showAnglesOfSelectedOrbit) {
            this.init();
        }
        this.raanAngleColor = 0x7FFFD4; //lightblue
        this.aopAngleColor  = 0x9966CC; //violet
        this.incAngleColor  = 0xB00000; //red
        this.taAngleColor   = 0xFC0FC0; //pink
    }

    init() {
        this.initAnglesListener = this.initAngles.bind(this);
        document.addEventListener(Events.RENDER, this.initAnglesListener);
    }

    initAngles(event) {
        const keplerianObject = this.trajectory.getKeplerianObjectByEpoch(event.detail.epoch);
        let that = this;
        const originPosition = new FunctionOfEpochCustom((epoch) => {
            return that.trajectory.referenceFrame.getOriginPositionByEpoch(epoch)
        });

        this.calculateAdditionalParameters(keplerianObject);

        this.raanAngle = new HelperAngle(
            originPosition,
            this.trajectory.referenceFrame
                .getQuaternionByEpoch(event.detail.epoch)
                .rotate(new Vector([1, 0, 0])),
            this.trajectory.referenceFrame
                .getQuaternionByEpoch(event.detail.epoch)
                .rotate(new Vector([0, 0, 1])),
            keplerianObject.raan,
            this.raanAngleColor,
            3,
            true
        );

        this.aopAngle = new HelperAngle(
            originPosition,
            this.node,
            this.normal,
            keplerianObject.aop,
            this.aopAngleColor,
            2,
            true
        );

        this.incAngle = new HelperAngle(
            originPosition,
            this.nodePerp,
            this.node,
            keplerianObject.inc,
            this.incAngleColor,
            2,
            true
        );

        this.taAngle = new HelperAngle(
            originPosition,
            this.periapsis,
            this.normal,
            keplerianObject.getTrueAnomalyByEpoch(event.detail.epoch),
            this.taAngleColor,
            1.5,
            true
        );

        document.removeEventListener(Events.RENDER, this.initAnglesListener);
        this.updateAnglesListener = this.updateAngles.bind(this);
        document.addEventListener(Events.RENDER, this.updateAnglesListener);

        if ((this.trajectory.minEpoch !== null && this.trajectory.minEpoch !== false && event.detail.epoch < this.trajectory.minEpoch)
            || (this.trajectory.maxEpoch !== null && this.trajectory.maxEpoch !== false && event.detail.epoch > this.trajectory.maxEpoch)
        ) {
            this.raanAngle.hide();
            this.aopAngle.hide();
            this.incAngle.hide();
            this.taAngle.hide();
        }
    }

    updateAngles(event) {
        if ((this.trajectory.minEpoch !== null && this.trajectory.minEpoch !== false && event.detail.epoch < this.trajectory.minEpoch)
            || (this.trajectory.maxEpoch !== null && this.trajectory.maxEpoch !== false && event.detail.epoch > this.trajectory.maxEpoch)
        ) {
            this.raanAngle.hide();
            this.aopAngle.hide();
            this.incAngle.hide();
            this.taAngle.hide();
            return;
        }

        const keplerianObject = this.trajectory.getKeplerianObjectByEpoch(event.detail.epoch);
        this.calculateAdditionalParameters(keplerianObject);

        this.raanAngle.resize(keplerianObject.raan);
        this.raanAngle.rearrange(
            this.trajectory.referenceFrame
                .getQuaternionByEpoch(event.detail.epoch)
                .rotate(new Vector([1, 0, 0])),

            this.trajectory.referenceFrame
                .getQuaternionByEpoch(event.detail.epoch)
                .rotate(new Vector([0, 0, 1]))
        );

        this.aopAngle.resize(keplerianObject.aop);
        this.aopAngle.rearrange(this.node, this.normal);

        this.incAngle.resize(keplerianObject.inc);
        this.incAngle.rearrange(this.nodePerp, this.node);

        this.taAngle.resize(keplerianObject.getTrueAnomalyByEpoch(event.detail.epoch));
        this.taAngle.rearrange(this.periapsis, this.normal);
        this.raanAngle.show();
        this.aopAngle.show();
        this.incAngle.show();
        this.taAngle.show();
    }

    remove() {
        if (this.raanAngle) this.raanAngle.remove();
        if (this.aopAngle)  this.aopAngle.remove();
        if (this.incAngle)  this.incAngle.remove();
        if (this.taAngle)   this.taAngle.remove();

        document.removeEventListener(Events.RENDER, this.updateAnglesListener);
    }

    calculateAdditionalParameters(keplerianObject) {
        this.nodeQuaternion = new Quaternion(new Vector([0, 0, 1]), keplerianObject.raan);

        this.node = this.nodeQuaternion.rotate(new Vector([1, 0, 0]));
        this.normal = (new Quaternion(this.node, keplerianObject.inc)).rotate(new Vector([0, 0, 1]));
        this.aopQuaternion = new Quaternion(this.normal, keplerianObject.aop);

        this.periapsis = Quaternion.mul(this.aopQuaternion, this.nodeQuaternion).rotate(new Vector([1, 0, 0]));
        this.nodePerp = this.nodeQuaternion.rotate(
            new Vector([1, 0, 0])
                .rotateZ(Math.PI / 2)
        );
        this.node = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(this.node);

        this.normal = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(this.normal);

        this.periapsis = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(this.periapsis);

        this.nodePerp = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(this.nodePerp);
    }
}
