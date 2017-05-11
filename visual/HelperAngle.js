const INITIAL_SEGMENTS_NUMBER = 200;

class HelperAngle
{
    constructor(functionOfEpoch, mainAxis, normal, angleValue, color, coeff, isArcMode, callback) {
        this.value = angleValue;
        this.color = color;
        this.normal = (new THREE.Vector3).fromArray(normal).normalize();
        this.callback = callback;
        this.mainAxis = (new THREE.Vector3).fromArray(mainAxis).normalize();
        this.positionitionAtEpoch = functionOfEpoch;
        this.position = (new THREE.Vector3).fromArray(this.positionitionAtEpoch.evaluate(time.epoch).sub(camera.lastPosition));
        this.isArcMode = isArcMode;
        this.coeff = coeff ? coeff : 1;

        this.sizeParam = Math.round(Math.log2(camera.position.mag)) - 1;

        this.isEditMode = false;

        let quaternionZ = (new THREE.Quaternion).setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            this.normal
        );

        let quaternionX = (new THREE.Quaternion).setFromUnitVectors(
            (new THREE.Vector3(1, 0, 0)).applyQuaternion(quaternionZ),
            this.mainAxis
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

        this.onWheelListener = this.onMouseWheel.bind(this);
        document.addEventListener('vr_render', this.onWheelListener);

        this.init();
    }

    initEditMode() {
        this.isEditMode = true;
        this.mouseDownListener = this.onMouseDown.bind(this);
        document.addEventListener('mousedown', this.mouseDownListener);
    }

    init() {
        if (this.isArcMode === true) {
            let geometry = (new THREE.Path(
                (new THREE.EllipseCurve(
                    0, 0,
                    Math.pow(2, this.sizeParam) / (3 * this.coeff), Math.pow(2, this.sizeParam) / (3 * this.coeff),
                    0, this.value,
                    false,
                    0
                )).getPoints(100)
            )).createPointsGeometry(100);

            let material = new THREE.LineBasicMaterial({color: this.color});
            this.threeAngle = new LineObject(geometry, material);

            geometry = new THREE.Geometry();
            geometry.vertices.push(
                this.position,
                this.position.clone().add(this.mainAxis.clone().setLength(Math.pow(2, this.sizeParam) / this.coeff))
            );
            this.threeMainAxis = new THREE.Line(geometry, material);

            material = new THREE.LineBasicMaterial({color : this.isEditMode ? 0xc2f442 : this.color});
            geometry = new THREE.Geometry();
            geometry.vertices.push(
                this.position,
                this.position.clone().add(this.direction.clone().setLength(Math.pow(2, this.sizeParam) / this.coeff))
            );

            this.threeDirection = new THREE.Line(geometry, material);

        } else {

            let geometry = new THREE.CircleGeometry(
                Math.pow(2, this.sizeParam) / this.coeff,
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

            this.threeMainAxis = new THREE.ArrowHelper(
                this.mainAxis,
                this.position,
                Math.pow(2, this.sizeParam) / this.coeff,
                this.color
            );

            this.threeDirection = new THREE.ArrowHelper(
                this.direction,
                this.position,
                Math.pow(2, this.sizeParam) / this.coeff,
                this.isEditMode ? 0xc2f442 : this.color
            );
        }

        this.threeAngle.position.copy(this.position);
        this.threeAngle.quaternion.copy(this.quaternion);
        scene.add(this.threeAngle);
        scene.add(this.threeMainAxis);
        scene.add(this.threeDirection);
    }

    onRender(event) {
        this.position = (new THREE.Vector3).fromArray(
            this.positionitionAtEpoch.evaluate(event.detail.epoch)
                .sub(camera.lastPosition)
        );

        if (this.isArcMode === true) {
            this.threeMainAxis.geometry.dispose();
            this.threeDirection.geometry.dispose();

            this.threeMainAxis.geometry = new THREE.Geometry();
            this.threeDirection.geometry = new THREE.Geometry();

            this.threeMainAxis.geometry.vertices.push(
                this.position,
                this.position.clone().add(this.mainAxis.clone().setLength(Math.pow(2, this.sizeParam) / this.coeff))
            );

            this.threeDirection.geometry.vertices.push(
                this.position,
                this.position.clone().add(this.direction.clone().setLength(Math.pow(2, this.sizeParam) / this.coeff))
            );
        } else {
            this.threeMainAxis.position.copy(this.position);
            this.threeDirection.position.copy(this.position);
        }

        this.threeAngle.position.copy(this.position);
    }

    resize(newValue) {
        this.value = newValue;

        this.threeAngle.geometry.dispose();
        this.threeAngle.geometry = (this.isArcMode) ? 
            (new THREE.Path(
                (new THREE.EllipseCurve(
                    0, 0,
                    Math.pow(2, this.sizeParam) / (3 * this.coeff), Math.pow(2, this.sizeParam) / (3 * this.coeff),
                    0, this.value,
                    false,
                    0
                )).getPoints(100)
            )).createPointsGeometry(100)
            :
            (new THREE.CircleGeometry(
                Math.pow(2, this.sizeParam) / this.coeff,
                INITIAL_SEGMENTS_NUMBER,
                0,
                this.value
            ));

        this.direction = this.mainAxis
                .clone()
                .applyAxisAngle(this.normal, this.value);

        if (this.isArcMode === true) {
            this.threeDirection.geometry.dispose();

            this.threeDirection.geometry = new THREE.Geometry();

            this.threeDirection.geometry.vertices.push(
                this.position,
                this.position.clone().add(this.direction.clone().setLength(Math.pow(2, this.sizeParam) / this.coeff))
            );
        } else {
            this.threeDirection.setDirection(this.direction);
        }

        if (this.callback) {
            this.callback(newValue);
        }
    }

    rearrange(newMainAxis, newNormal) {
        this.mainAxis = (new THREE.Vector3).fromArray(newMainAxis).normalize();
        this.normal = (new THREE.Vector3).fromArray(newNormal).normalize();

        this.direction = this.mainAxis
            .clone()
            .applyAxisAngle(this.normal, this.value);

        if (this.isArcMode === true) {
            this.threeMainAxis.geometry.dispose();
            this.threeDirection.geometry.dispose();

            this.threeMainAxis.geometry = new THREE.Geometry();
            this.threeDirection.geometry = new THREE.Geometry();

            this.threeMainAxis.geometry.vertices.push(
                this.position,
                this.position.clone().add(this.mainAxis.clone().setLength(Math.pow(2, this.sizeParam) / this.coeff))
            );

            this.threeDirection.geometry.vertices.push(
                this.position,
                this.position.clone().add(this.direction.clone().setLength(Math.pow(2, this.sizeParam) / this.coeff))
            );
        } else {
            this.threeMainAxis.setDirection(this.mainAxis);
            this.threeDirection.setDirection(this.direction);
        }

        let quaternionZ = (new THREE.Quaternion).setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            this.normal
        );

        let quaternionX = (new THREE.Quaternion).setFromUnitVectors(
            (new THREE.Vector3(1, 0, 0)).applyQuaternion(quaternionZ),
            this.mainAxis
        );

        this.quaternion = quaternionX.multiply(quaternionZ);
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
        let intersection
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
        if (Math.round(Math.log2(camera.position.mag)) - 1 != this.sizeParam) {
            this.sizeParam = Math.round(Math.log2(camera.position.mag)) - 1;

            this.threeAngle.geometry.dispose();
            this.threeAngle.geometry = (this.isArcMode) ?
                (new THREE.Path(
                    (new THREE.EllipseCurve(
                        0, 0,
                        Math.pow(2, this.sizeParam) / (3 * this.coeff), Math.pow(2, this.sizeParam) / (3 * this.coeff),
                        0, this.value,
                        false,
                        0
                    )).getPoints(100)
                )).createPointsGeometry(100)
                :
                (new THREE.CircleGeometry(
                    Math.pow(2, this.sizeParam) / this.coeff,
                    INITIAL_SEGMENTS_NUMBER,
                    0,
                    this.value
                ));

            if (this.isArcMode === true) {
                this.threeMainAxis.geometry.dispose();
                this.threeDirection.geometry.dispose();

                this.threeMainAxis.geometry = new THREE.Geometry();
                this.threeDirection.geometry = new THREE.Geometry();

                this.threeMainAxis.geometry.vertices.push(
                    this.position,
                    this.position.clone().add(this.mainAxis.clone().setLength(Math.pow(2, this.sizeParam) / this.coeff))
                );

                this.threeDirection.geometry.vertices.push(
                    this.position,
                    this.position.clone().add(this.direction.clone().setLength(Math.pow(2, this.sizeParam) / this.coeff))
                );
            } else {
                this.threeMainAxis.setLength(Math.pow(2, this.sizeParam) / this.coeff, this.threeMainAxis.headLength, this.threeMainAxis.headWidth);
                this.threeDirection.setLength(Math.pow(2, this.sizeParam) / this.coeff, this.threeDirection.headLength, this.threeDirection.headWidth);
            }
        }
    }

    remove() {
        scene.remove(this.threeAngle);
        scene.remove(this.threeMainAxis);
        scene.remove(this.threeDirection);

        document.removeEventListener('vr_render', this.onRenderListener);
    }
}