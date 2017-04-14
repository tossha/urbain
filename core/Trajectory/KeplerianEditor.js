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
        

        /*this.incAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            ,
            ,
            keplerianObject.inc,
            0xB00000 //red
        );

        this.raanAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            ,
            ,
            keplerianObject.raan,
            0x7FFFD4 //lightblue
        );*/

        let parentX = (new THREE.Vector3).fromArray(
            this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(new Vector([1, 0, 0])))
            .normalize();
        let parentZ = (new THREE.Vector3).fromArray(
            this.trajectory.referenceFrame
            .getQuaternionByEpoch(event.detail.epoch)
            .rotate(new Vector([0, 0, 1])))
            .normalize();

        let orbitQuaternion = (new THREE.Quaternion).setFromAxisAngle(parentX, keplerianObject.inc)
            .multiply((new THREE.Quaternion).setFromAxisAngle(parentZ, keplerianObject.raan))
            .multiply((new THREE.Quaternion)
                .fromArray(this.trajectory.referenceFrame
                    .getQuaternionByEpoch(event.detail.epoch).toVTArray()));

        let orbitNormalThree = new THREE.Vector3(0, 0, 1).applyQuaternion(orbitQuaternion);
        let orbitNormal = new Vector([
            orbitNormalThree.x,
            orbitNormalThree.y,
            orbitNormalThree.z
        ]);

        let orbitXThree = new THREE.Vector3(0, 0, 1).applyQuaternion(orbitQuaternion);
        let orbitX = new Vector([
            orbitXThree.x,
            orbitXThree.y,
            orbitXThree.z
        ]);

        this.aopAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            orbitX,
            orbitNormal,
            keplerianObject.aop,
            0x9966CC //violet
        );

        /*this.taAngle = new HelperAngle(
            new FunctionOfEpochObjectPosition(this.trajectory.referenceFrame.origin, RF_BASE),
            orbitX,
            orbitNormal,
            keplerianObject.ta,
            0xFC0FC0 //pink
        );*/

        this.test = new THREE.ArrowHelper(
            parentZ,
            this.aopAngle.position.clone().sub(camera.lastPosition),
            Math.pow(2, 14),
            0xFC0FC0
        );

        document.removeEventListener('vr_render', this.initAnglesImproved);
        this.updateAnglesImproved = this.updateAngles.bind(this);
        document.addEventListener('vr_render', this.updateAnglesImproved);
    }

    updateAngles() {
        const keplerianObject = this.trajectory.keplerianObject || this.trajectory.getKeplerianObjectByEpoch(event.detail.epoch);
        this.aopAngle.resize(keplerianObject.aop);
        //this.taAngle.resize(keplerianObject.ta);

        this.aopAngle.position.clone().sub(camera.lastPosition);
    }
}