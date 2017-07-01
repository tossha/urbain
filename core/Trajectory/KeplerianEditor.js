class KeplerianEditor 
{
    constructor(trajectory, isEditMode) {
        this.isEditMode = isEditMode;
        this.trajectory = trajectory;

        this.initAnglesImproved = this.initAngles.bind(this);
        document.addEventListener('vr_render', this.initAnglesImproved);
    }

    initAngles(event) {
        const keplerianObject = this.trajectory.getKeplerianObjectByEpoch(event.detail.epoch);

        this.raanAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            this.trajectory.referenceFrame
                .getQuaternionByEpoch(event.detail.epoch)
                .rotate(new Vector([1, 0, 0])),
            this.trajectory.referenceFrame
                .getQuaternionByEpoch(event.detail.epoch)
                .rotate(new Vector([0, 0, 1])),
            keplerianObject.raan,
            0x7FFFD4, //lightblue
            3,
            true
        );

        let nodeQuaternion = new Quaternion(new Vector([0, 0, 1]), keplerianObject.raan);
        let node = nodeQuaternion.rotate(new Vector([1, 0, 0]));
        let normal = (new Quaternion(node, keplerianObject.inc)).rotate(new Vector([0, 0, 1]));
        let aopQuaternion = new Quaternion(normal, keplerianObject.aop);

        let periapsisQuaternion = Quaternion.mul(aopQuaternion, nodeQuaternion);
        let periapsis = Quaternion.mul(aopQuaternion, nodeQuaternion).rotate(new Vector([1, 0, 0]));

        normal = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(normal);

        periapsis = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(periapsis);

        node = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(node);

        this.aopAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            node,
            normal,
            keplerianObject.aop,
            0x9966CC, //violet
            1,
            true
        );

        let nodePerp = nodeQuaternion.rotate(
            new Vector([1, 0, 0]));

        nodePerp = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(nodePerp);

        this.incAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            nodePerp,
            node,
            keplerianObject.inc,
            0xB00000, //red
            3,
            true
        );

        this.taAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            periapsis,
            normal,
            keplerianObject.ta,
            0xFC0FC0, //pink
            3,
            true
        );

        document.removeEventListener('vr_render', this.initAnglesImproved);
        this.updateAnglesImproved = this.updateAngles.bind(this);
        document.addEventListener('vr_render', this.updateAnglesImproved);
    }

    updateAngles(event) {
        const keplerianObject = this.trajectory.getKeplerianObjectByEpoch(event.detail.epoch);
        this.raanAngle.resize(keplerianObject.raan);
        this.raanAngle.rearrange(
            this.trajectory.referenceFrame
                .getQuaternionByEpoch(event.detail.epoch)
                .rotate(new Vector([1, 0, 0])),

            this.trajectory.referenceFrame
                .getQuaternionByEpoch(event.detail.epoch)
                .rotate(new Vector([0, 0, 1]))
        );

        let nodeQuaternion = new Quaternion(new Vector([0, 0, 1]), keplerianObject.raan);
        let node = nodeQuaternion.rotate(new Vector([1, 0, 0]));
        let normal = (new Quaternion(node, keplerianObject.inc)).rotate(new Vector([0, 0, 1]));
        let aopQuaternion = new Quaternion(normal, keplerianObject.aop);

        let periapsisQuaternion = Quaternion.mul(aopQuaternion, nodeQuaternion);
        let periapsis = Quaternion.mul(aopQuaternion, nodeQuaternion).rotate(new Vector([1, 0, 0]));

        normal = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(normal);

        periapsis = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(periapsis);

        node = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(node);

        this.aopAngle.resize(keplerianObject.aop);
        this.aopAngle.rearrange(node, normal);

        let nodePerp = nodeQuaternion
            .rotate(
                (new Vector([1, 0, 0]))
                    .rotateZ(Math.PI / 2));

        nodePerp = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(nodePerp);

        this.incAngle.resize(keplerianObject.inc);
        this.incAngle.rearrange(nodePerp, node);

        this.taAngle.resize(keplerianObject.ta);
        this.taAngle.rearrange(periapsis, normal);
    }

    remove() {
        this.raanAngle.remove();
        this.aopAngle.remove();
        this.incAngle.remove();
        this.taAngle.remove();

        document.removeEventListener('vr_render', this.updateAnglesImproved);
    }
}