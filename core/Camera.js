class Camera
{

    constructor (domElement, eventHandler, initialOrbitingPoint, initialPosition) {
        let that = this;

        this.threeCamera = new THREE.PerspectiveCamera(60, domElement.width / domElement.height, 1, 1e15);
        this.domElement = domElement;
        this.isMouseDown = false;
        this.orbitingPoint = initialOrbitingPoint;

        this.position = initialPosition;

        this.currentMousePos = new Vector([0, 0]);
        this.accountedMousePos = new Vector([0, 0]);

        this.threeCamera.position.fromArray([0, 0, 0]);

        this.rightButtonDown = false;

        eventHandler.addListener('mousedown', this.onMouseDown.bind(this) , 1);
        eventHandler.addListener('mousemove', this.onMouseMove.bind(this) , 1);
        eventHandler.addListener('mouseup',   this.onMouseUp.bind(this)   , 1);
        eventHandler.addListener('wheel',     this.onMouseWheel.bind(this), 1);
    }

    init(epoch) {
        this.lastEpoch = epoch;
        this.setOrbitingPoint(this.orbitingPoint);
    }

    updatePole(epoch) {
        if (BODIES[this.orbitingPoint] === undefined) {
            this.pole = new Vector([0, 0, 1]);
        } else {
            this.pole = BODIES[this.orbitingPoint].orientation.getQuaternionByEpoch(epoch).rotate_(new Vector([0, 0, 1]));
        }
    }

    _getQuaternionByPosition(position) {
        const defaultDirection = new Vector([0, 0, 1]); // must be unit length
        const defaultUp = new Vector([0, 1, 0]);        // must be unit length

        const directionQuaternion = (new Quaternion()).setAxisAngle(
            defaultDirection.cross(position),
            Math.acos(position.dot(defaultDirection) / position.mag)
        );

        const newUp = directionQuaternion.rotate(defaultUp);
        const neededUp = (new Quaternion()).setAxisAngle(
            position.cross(this.pole),
            Math.PI / 2
        ).rotate(position);

        let rollQuaternion = (new Quaternion()).setAxisAngle(
            newUp.cross(neededUp),
            Math.acos(newUp.dot(neededUp) / neededUp.mag)
        );

        return rollQuaternion.mul(directionQuaternion);
    }

    setOrbitingPoint(pointId) {
        this.position
            .add_(App.getTrajectory(this.orbitingPoint).getPositionByEpoch(this.lastEpoch, RF_BASE))
            .sub_(App.getTrajectory(pointId).getPositionByEpoch(this.lastEpoch, RF_BASE));
        this.orbitingPoint = pointId;
        this.updatePole(this.lastEpoch);
        this.quaternion = this._getQuaternionByPosition(this.position);
    }

    getOrbitingPointPosition(epoch) {
        return App.getTrajectory(this.orbitingPoint).getPositionByEpoch(epoch, RF_BASE);
    }

    onMouseWheel(event) {
        const koeff = 1.5;
        if (event.deltaY < 0) {
            this.position.scale(1 / koeff);
        } else if (event.deltaY > 0) {
            this.position.scale(koeff);
        }

        if (helperGrid) {
            helperGrid.onZoom(this.position.mag);
        }
    }

    onMouseDown(event) {
        this.accountedMousePos = new Vector([event.clientX, event.clientY]);
        this.currentMousePos = Vector.copy(this.accountedMousePos);
        this.isMouseDown = true;
        switch ( event.button ) {
        case 0: //left
            break;
        case 1: // middle
            break;
        case 2: this.rightButtonDown = true;
            break;
}
    }

    onMouseMove(event) {
        if (this.isMouseDown) {
            this.currentMousePos.set(event.clientX, event.clientY);
        }
    }

    onMouseUp(event) {
        this.isMouseDown = false;
        this.rightButtonDown = false;
    }

    onResize() {
        this.threeCamera.aspect = this.domElement.width / this.domElement.height;
        this.threeCamera.updateProjectionMatrix();
    }

    update(epoch) {
        let mouseShift = this.currentMousePos.sub(this.accountedMousePos);

        this.updatePole(epoch);

        if (mouseShift[0] || mouseShift[1]) {
            const polarConstraint = 0.00001;
            let poleAngle = this.position.angle(this.pole);
            let verticalRotationAxis = this.rightButtonDown
                ? this.quaternion.rotate(new Vector([0, 0, 1])).cross(this.pole)
                : this.position.cross(this.pole);

            let verticalQuaternion = new Quaternion(verticalRotationAxis, Math.min(Math.max(mouseShift[1] * 0.01, poleAngle - Math.PI + polarConstraint), poleAngle - polarConstraint));
            let mainQuaternion = (new Quaternion()).setAxisAngle(this.pole, -mouseShift[0] * 0.01).mul(verticalQuaternion);

            if (!this.rightButtonDown) {
                mainQuaternion.rotate_(this.position);
            }
            this.quaternion = mainQuaternion.mul(this.quaternion);

            this.accountedMousePos = Vector.copy(this.currentMousePos);
        }
        this.threeCamera.quaternion.copy(this.quaternion.toThreejs());
        this.lastPosition = this.getOrbitingPointPosition(epoch).add_(this.position);
        this.lastEpoch = epoch;
    }
}
