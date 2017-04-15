class KeplerianEditor 
{
    constructor(trajectory, isEditMode) {
        this.isEditMode = isEditMode;
        this.trajectory = trajectory;

        this.initAnglesImproved = this.initAngles.bind(this);
        document.addEventListener('vr_render', this.initAnglesImproved);
    }
    /*editExisting() {
        
    }

    static createNew() {
        if (KeplerianEditor.isEditMode !== true) {

            KeplerianEditor.helperGrid = new HelperGrid(App.getReferenceFrame(settings.trackingObject, RF_TYPE_EQUATORIAL));
            KeplerianEditor.isEditMode = true;

            //plane
        }

        
    }

    static abortCreating() {
        if ((KeplerianEditor.isEditMode)&&(KeplerianEditor.helperGrid !== undefined)) {
            KeplerianEditor.helperGrid.remove();

            KeplerianEditor.isEditMode = false;
        }
    }*/

    initAngles(event) {
        const keplerianObject = this.trajectory.keplerianObject || this.trajectory.getKeplerianObjectByEpoch(event.detail.epoch);

        this.raanAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            new Vector([1, 0, 0]),
            new Vector([0, 0, 1]),
            keplerianObject.raan,
            0x7FFFD4 //lightblue
        );

        let normal = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(
                (new Vector([0, 0, 1]))
                    .rotateX(keplerianObject.inc)
                    .rotateZ(keplerianObject.raan)
            );

        let node = this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(
                (new Vector([1, 0, 0]))
                    .rotateZ(keplerianObject.raan)
            );

        this.aopAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            node,
            normal,
            keplerianObject.aop,
            0x9966CC //violet
        );

       this.incAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            Vector.copy(node).rotateZ(- Math.PI / 2),
            node,
            keplerianObject.inc,
            0xB00000 //red
        );

        let periapsis = new Vector([
            this.aopAngle.direction.x,
            this.aopAngle.direction.y,
            this.aopAngle.direction.z
        ]);

        this.taAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            periapsis,
            normal,
            keplerianObject.ta,
            0xFC0FC0 //pink
        );

        document.removeEventListener('vr_render', this.initAnglesImproved);
        this.updateAnglesImproved = this.updateAngles.bind(this);
        document.addEventListener('vr_render', this.updateAnglesImproved);
    }

    updateAngles() {
        const keplerianObject = this.trajectory.keplerianObject || this.trajectory.getKeplerianObjectByEpoch(event.detail.epoch);
        

        this.aopAngle.position.clone().sub(camera.lastPosition);
        this.aopAngle.resize(keplerianObject.aop);

        this.raanAngle.position.clone().sub(camera.lastPosition);
        this.raanAngle.resize(keplerianObject.raan);

        this.incAngle.position.clone().sub(camera.lastPosition);
        this.incAngle.resize(keplerianObject.inc);

        this.taAngle.position.clone().sub(camera.lastPosition);
        this.taAngle.resize(keplerianObject.ta);
    }
}