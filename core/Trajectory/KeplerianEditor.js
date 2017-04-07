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
        if (this.trajectory.keplerianObject !== undefined) {
            const keplerianObject = this.trajectory.keplerianObject;
        } else {
            const keplerianObject = this.trajectory.getKeplerianObjectByEpoch(event.detail.epoch)
        }

        /*this.incAngle = new HelperAngle(
            new FunctionOfEpochTrajectoryPosition(this.trajectory, RF_BASE),
            ,
            ,
            keplerianObject.inc,
            0xB00000
        );

        this.raanAngle = new HelperAngle(
            new FunctionOfEpochTrajectoryPosition(this.trajectory, RF_BASE),
            ,
            ,
            keplerianObject.raan,
            0x7FFFD4
        );*/

        let orbitNormal = this.trajectory.referenceFrame.getQuaternionByEpoch(time.epoch).rotate(new Vector([0, 0, 1]));
        let orbitX = this.trajectory.referenceFrame.getQuaternionByEpoch(time.epoch).rotate(new Vector([1, 0, 0]));

        this.aopAngle = new HelperAngle(
            new FunctionOfEpochTrajectoryPosition(this.trajectory, RF_BASE),
            orbitX,
            orbitNormal,
            keplerianObject.aop,
            0x9966CC
        );

        this.taAngle = new HelperAngle(
            new FunctionOfEpochTrajectoryPosition(this.trajectory, RF_BASE),
            orbitX,
            orbitNormal,
            keplerianObject.ta,
            0xFC0FC0
        );

        document.removeEventListener('vr_render', this.initAnglesImproved);
        this.updateAnglesImproved = this.updateAngles.bind(this);
        document.addEventListener('vr_render', this.updateAnglesImproved);
    }

    updateAngles() {
        const keplerianObject = this.trajectory.getKeplerianObjectByEpoch(event.detail.epoch) || this.trajectory.keplerianObject;
        this.aopAngle.resize(keplerianObject.aop);
        this.taAngle.resize(keplerianObject.ta);
    }
}