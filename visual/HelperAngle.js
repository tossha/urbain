const INITIAL_SEGMENTS_NUMBER = 200;

class HelperAngle
{
    constructor(functionOfEpoch, mainAxis, normal, angleValue, color, coefficientOfAxesLengthDecrease, isArcMode, editingCallback) {
        this.value = angleValue;
        this.color = color;
        this.editingCallback = editingCallback;
        this.positionAtEpoch = functionOfEpoch;
        this.position = (new THREE.Vector3).fromArray(this.positionAtEpoch.evaluate(time.epoch).sub(camera.lastPosition));
        this.isArcMode = isArcMode;
        this.coefficientOfAxesLengthDecrease = coefficientOfAxesLengthDecrease ? coefficientOfAxesLengthDecrease : 1;

        this.setVectors(mainAxis, normal);

        this.sizeParam = camera.position.mag / 2;

        this.isEditMode = false;

        if (this.editingCallback) {
            this.initEditMode();
        }

        this.onRenderListener = this.onRender.bind(this);
        document.addEventListener(Events.RENDER, this.onRenderListener);

        this.onWheelListener = this.onMouseWheel.bind(this);
        document.addEventListener('wheel', this.onWheelListener);

        this.init();
    }

    initEditMode() {
        this.isEditMode = true;
        this.mouseDownListener = this.onMouseDown.bind(this);
        document.addEventListener('mousedown', this.mouseDownListener);
    }

    init() {
        if (this.isArcMode === true) {
            this.createArcModeAngleGeometry();

            let material = new THREE.LineBasicMaterial({color: this.color});
            this.threeAngle = new LineObject(this.threeAnglegeometry, material);

            this.createPointersGeometries();
            this.threeMainAxis = new THREE.Line(this.threeMainAxis.geometry, material);
            this.threeDirection = new THREE.Line(this.threeDirection.geometry, material);

        } else {
            this.createSectorModeAngleGeometry();

            let material = new THREE.MeshBasicMaterial({
                color: this.color,
                opacity: 0.175,
                transparent: true,
                side: THREE.DoubleSide
            });

            this.threeAngle = new THREE.Mesh(geometry, material);

            this.threeMainAxis = new THREE.ArrowHelper(
                this.mainAxis,
                this.position,
                this.sizeParam / this.coefficientOfAxesLengthDecrease,
                this.color
            );

            this.threeDirection = new THREE.ArrowHelper(
                this.direction,
                this.position,
                this.sizeParam / this.coefficientOfAxesLengthDecrease,
                this.isEditMode ? 0xc2f442 : this.color
            );
        }

        this.calculateQuaternions();

        this.threeAngle.position.copy(this.position);
        this.threeAngle.quaternion.copy(this.quaternion);
        scene.add(this.threeAngle);
        scene.add(this.threeMainAxis);
        scene.add(this.threeDirection);
    }

    onRender(event) {
        this.position = (new THREE.Vector3).fromArray(
            this.positionAtEpoch.evaluate(event.detail.epoch)
                .sub(camera.lastPosition)
        );

        if (this.isArcMode === true) {
            this.deletePointersGeometries();
            this.createPointersGeometries();
        } else {
            this.threeMainAxis.position.copy(this.position);
            this.threeDirection.position.copy(this.position);
        }

        this.threeAngle.position.copy(this.position);
    }

    resize(newValue) {
        this.value = newValue;

        this.disposeGeometry(this.threeAngle);

        this.direction = this.mainAxis
                .clone()
                .applyAxisAngle(this.normal, this.value);

        if (this.isArcMode === true) {
            this.disposeGeometry(this.threeDirection);

            this.threeDirection.geometry = new THREE.Geometry();
            this.threeDirection.geometry.vertices.push(
                this.position,
                this.position.clone().add(this.direction.clone().setLength(this.sizeParam / this.coefficientOfAxesLengthDecrease))
            );

            this.createArcModeAngleGeometry();
        } else {
            this.threeDirection.setDirection(this.direction);
            this.createSectorModeAngleGeometry();
        }

        if (this.editingCallback) {
            this.editingCallback(newValue);
        }
    }

    rearrange(newMainAxis, newNormal) {
        this.setVectors(newMainAxis, newNormal);

        if (this.isArcMode === true) {
            this.deletePointersGeometries();
            this.createPointersGeometries();
        } else {
            this.threeMainAxis.setDirection(this.mainAxis);
            this.threeDirection.setDirection(this.direction);
        }

        this.calculateQuaternions();
        this.threeAngle.quaternion.copy(this.quaternion);
    }

    getVirtualPlane() {
        let mrVector = (new THREE.Vector3).crossVectors(this.normal, this.position); //logic for names is required
        let mrCathetus = (new THREE.Vector3).crossVectors(this.normal, mrVector);
        let cos = this.position.dot(mrCathetus) / (this.position.length() * mrCathetus.length());
        let angle = (cos >= 0) ? Math.acos(cos) : Math.PI - Math.acos(cos);
        let distance = this.position.length() * Math.sin(angle);

        if (this.virtualPlane) {
            this.virtualPlane.constant = -distance;
        } else {
            this.virtualPlane = new VirtualPlane(this.normal, -distance);
        }

        return this.virtualPlane;
    }

     onMouseDown(event) {
        let intersection;
        if (this.isArcMode === true) {
            intersection = raycaster.intersectObjects(
                [this.threeDirection.line]
        )[0];
            } else {
            intersection = raycaster.intersectObjects(
                [this.threeDirection.line, this.threeDirection.cone]
        )[0];
        }

        if ((intersection !== undefined) && (event.button == 0)) { //check if the mouse button pressed is left
            this.mouseUpListener = this.onMouseUp.bind(this);
            document.addEventListener('mouseup', this.mouseUpListener);
            this.mouseMoveListener = this.onMouseMove.bind(this);
            rendererEvents.addListener('mousemove', this.mouseMoveListener, 2);
        }
    }

    onMouseUp(event) {
        document.removeEventListener('mouseup', this.mouseUpListener);
        rendererEvents.removeListener('mousemove', this.mouseMoveListener);
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

    onMouseWheel() {
        this.sizeParam = camera.position.mag / 2;

        this.disposeGeometry(this.threeAngle);

        if (this.isArcMode === true) {
            this.createArcModeAngleGeometry();
            this.deletePointersGeometries();
            this.createPointersGeometries();
        } else {
            this.createSectorModeAngleGeometry();
            this.threeMainAxis.setLength(this.sizeParam / this.coefficientOfAxesLengthDecrease, this.threeMainAxis.headLength, this.threeMainAxis.headWidth);
            this.threeDirection.setLength(this.sizeParam / this.coefficientOfAxesLengthDecrease, this.threeDirection.headLength, this.threeDirection.headWidth);
        }
    }

    remove() {
        scene.remove(this.threeAngle);
        scene.remove(this.threeMainAxis);
        scene.remove(this.threeDirection);

        document.removeEventListener(Events.RENDER, this.onRenderListener);
    }

    createPointersGeometries() {
        if (this.threeMainAxis === undefined){
            this.threeMainAxis = {};
            this.threeDirection = {}; 
        }
        this.threeMainAxis.geometry  = new THREE.Geometry();
        this.threeDirection.geometry = new THREE.Geometry();

        this.threeMainAxis.geometry.vertices.push(
            this.position,
            this.position.clone().add(this.mainAxis.clone().setLength(this.sizeParam / this.coefficientOfAxesLengthDecrease))
        );

        this.threeDirection.geometry.vertices.push(
            this.position,
            this.position.clone().add(this.direction.clone().setLength(this.sizeParam / this.coefficientOfAxesLengthDecrease))
        );
    }

    deletePointersGeometries() {
        this.disposeGeometry(this.threeMainAxis);
        this.disposeGeometry(this.threeDirection)
    }

    setVectors(mainAxis, normal) {
        this.mainAxis = (new THREE.Vector3).fromArray(mainAxis).normalize();
        this.normal   = (new THREE.Vector3).fromArray(normal).normalize();

        this.direction = this.mainAxis
            .clone()
            .applyAxisAngle(this.normal, this.value);
    }

    createArcModeAngleGeometry() {
        if (this.threeAngle === undefined) {
            this.threeAngle = {}
        }

        this.threeAngle.geometry = (new THREE.Path(
            (new THREE.EllipseCurve(
                0, 0,
                this.sizeParam / (3 * this.coefficientOfAxesLengthDecrease), this.sizeParam / (3 * this.coefficientOfAxesLengthDecrease),
                0, this.value,
                false,
                0
            )).getPoints(100)
        )).createPointsGeometry(100);
    }

    createSectorModeAngleGeometry() {
        if (this.threeAngle === undefined) {
            this.threeAngle = {}
        }

        this.threeAngle.geometry = new THREE.CircleGeometry(
            this.sizeParam / this.coefficientOfAxesLengthDecrease,
            INITIAL_SEGMENTS_NUMBER,
            0,
            this.value
        );
    }

    disposeGeometry(objectOfDisposal) {
        objectOfDisposal.geometry.dispose();
    }

    calculateQuaternions() {
        let quaternionZ = (new THREE.Quaternion).setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            this.normal
        );

        let quaternionX = (new THREE.Quaternion).setFromUnitVectors(
            (new THREE.Vector3(1, 0, 0)).applyQuaternion(quaternionZ),
            this.mainAxis
        );

        this.quaternion = quaternionX.multiply(quaternionZ);
    }
}