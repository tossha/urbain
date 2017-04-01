const INITIAL_LENGTH = Math.pow(2, 14);
const INITIAL_SEGMENTS_NUMBER = 200;

class HelperAngle
{
    constructor(functionOfEpoch, mainAxis, normal, angleValue, color, callback) {
        this.value = angleValue;
        this.color = color;
        this.normal = (new THREE.Vector3).fromArray(normal).normalize();
        this.callback = callback;
        this.mainAxis = (new THREE.Vector3).fromArray(mainAxis).normalize();
        this.positionAtEpoch = functionOfEpoch;
        this.pos = (new THREE.Vector3).fromArray(this.positionAtEpoch.evaluate(time.epoch).sub(camera.lastPosition));

        this.isEditMode = false;

        let quaternionX = (new THREE.Quaternion).setFromUnitVectors(
            new THREE.Vector3(1, 0, 0),
            this.mainAxis
        );

        let quaternionZ = (new THREE.Quaternion).setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            this.normal
        );

        this.quaternion = quaternionX.multiply(quaternionZ);

        this.direction = this.mainAxis
            .clone()
            .applyAxisAngle(this.normal, this.value);

        if (this.callback) {
            this.initEditMode();
        }

        this.onRenderListener = this.onRender.bind(this);
        document.addEventListener('vr_render', this.onRenderListener);

        this.init();
    }

    initEditMode() {
        this.isEditMode = true;
        this.mouseDownListener = this.onMouseDown.bind(this);
        document.addEventListener('mousedown', this.mouseDownListener);
    }

    init() {
        let geometry = new THREE.CircleGeometry(
            INITIAL_LENGTH,
            INITIAL_SEGMENTS_NUMBER,
            0,
            this.value
        );
        let material = new THREE.MeshBasicMaterial({
            color: this.color,
            opacity: 0.175,
            transparent: true,
            side: THREE.DoubleSide
        });
        this.threeAngle = new THREE.Mesh(geometry, material);

        this.threeAngle.position.copy(this.pos);
        this.threeAngle.quaternion.copy(this.quaternion);

        scene.add(this.threeAngle);

        this.threeMainAxis = new THREE.ArrowHelper(
            this.mainAxis,
            this.pos,
            INITIAL_LENGTH,
            this.color
        );

        scene.add(this.threeMainAxis);

        this.threeDirection = new THREE.ArrowHelper(
            this.direction,
            this.pos,
            INITIAL_LENGTH,
            this.isEditMode ? 0xc2f442 : this.color
        );

        scene.add(this.threeDirection);
    }

    onRender(epoch) {
        this.pos = (new THREE.Vector3).fromArray(
            this.positionAtEpoch.evaluate(epoch)
                .sub(camera.lastPosition)
        );

        this.threeAngle.position.copy(this.pos);
        this.threeMainAxis.position.copy(this.pos);
        this.threeDirection.position.copy(this.pos);
    }

    resize(newValue) {
        this.value = newValue;

        this.threeAngle.geometry.dispose();
        this.threeAngle.geometry = new THREE.CircleGeometry(
            INITIAL_LENGTH,
            INITIAL_SEGMENTS_NUMBER,
            0,
            this.value
        );

        this.direction = this.mainAxis
            .clone()
            .applyAxisAngle(this.normal, this.value);
        this.threeDirection.setDirection(this.direction);

        if (this.callback) {
            this.callback(newValue);
        }
    }

    getVirtualPlane() {
        let mrVector = (new THREE.Vector3).crossVectors(this.normal, this.pos);
        let mrCathetus = (new THREE.Vector3).crossVectors(this.normal, mrVector);
        let cos = this.pos.dot(mrCathetus) / (this.pos.length() * mrCathetus.length());
        let angle = (cos >= 0) ? Math.acos(cos) : Math.PI - Math.acos(cos);
        let distance = this.pos.length() * Math.sin(angle);

        if (this.virtualPlane) {
            this.virtualPlane.constant = -distance;
        } else {
            this.virtualPlane = new VirtualPlane(this.normal, -distance);
        }

        return this.virtualPlane;
    }

     onMouseDown(event) {
        let intersection = raycaster.intersectObjects(
            [this.threeDirection.line, this.threeDirection.cone]
        )[0];
        if ((intersection !== undefined) && (event.button == 0)) { //check if the mouse button pressed is left
            this.mouseUpListener = this.onMouseUp.bind(this);
            document.addEventListener('mouseup', this.mouseUpListener);
            this.mouseMoveListener = this.onMouseMove.bind(this);
            document.addEventListener('mousemove', this.mouseMoveListener);
        }
    }

    onMouseUp(event) { //check if the mouse button pressed is left
        if (event.button == 0) {
            document.removeEventListener('mouseup', this.mouseUpListener);
            document.removeEventListener('mousemove', this.mouseMoveListener);
        }
    } 

    onMouseMove() {
        let intersection = raycaster.intersectObjects([this.getVirtualPlane()])[0];
        if (intersection !== undefined) { 
            const direction = intersection.point
                .clone()
                .sub(this.threeAngle.position)
                .normalize();

            let newAngleValue = Math.acos((this.mainAxis).dot(direction)); // no division by lengths because direction and mainAxis are normalized (length = 1)
            let tempVector = this.mainAxis.clone();
            tempVector.cross(direction);

            newAngleValue = (tempVector.dot(this.normal) > 0) ? newAngleValue : TWO_PI - newAngleValue;
            this.resize(newAngleValue);
        }   
    }

    remove() {
        scene.remove(this.threeAngle);
        scene.remove(this.threeMainAxis);
        scene.remove(this.threeDirection);

        document.removeEventListener('vr_render', this.onRenderListener);
    }
}