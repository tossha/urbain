class KeplerianEditor
{
    constructor(trajectory, isEditMode) {
        this.isEditMode = isEditMode;
        this.trajectory = trajectory;

        this.initAnglesListener = this.initAngles.bind(this);
        document.addEventListener('vr_render', this.initAnglesListener);

        this.raanAngleColor = 0x7FFFD4; //lightblue
        this.aopAngleColor  = 0x9966CC; //violet
        this.incAngleColor  = 0xB00000; //red
        this.taAngleColor   = 0xFC0FC0; //pink
    }

    initAngles(event) {
        const keplerianObject = this.trajectory.getKeplerianObjectByEpoch(event.detail.epoch);
        this.calculateAdditionalParameters(keplerianObject);

        this.raanAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
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
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            this.node,
            this.normal,
            keplerianObject.aop,
            this.aopAngleColor,
            1,
            true
        );

        this.incAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            this.nodePerp,
            this.node,
            keplerianObject.inc,
            this.incAngleColor,
            3,
            true
        );

        this.taAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            this.periapsis,
            this.normal,
            keplerianObject.ta,
            this.taAngleColor,
            3,
            true
        );

        document.removeEventListener('vr_render', this.initAnglesListener);
        this.updateAnglesListener = this.updateAngles.bind(this);
        document.addEventListener('vr_render', this.updateAnglesListener);
    }

    updateAngles(event) {
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

        this.taAngle.resize(keplerianObject.ta);
        this.taAngle.rearrange(this.periapsis, this.normal);
    }

    remove() {
        this.raanAngle.remove();
        this.aopAngle.remove();
        this.incAngle.remove();
        this.taAngle.remove();

        document.removeEventListener('vr_render', this.updateAnglesListener);
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
