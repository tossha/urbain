class Camera
{
    constructor (domElement, initialOrbitingPoint, initialPosition) {
        let that = this;

        this.threeCamera = new THREE.PerspectiveCamera(60, domElement.width / domElement.height, 1, 1000000000);
        this.domElement = domElement;
        this.isMouseDown = false;
        this.orbitingPoint = initialOrbitingPoint;

        this.pole = new Vector([0, 0, 1]);
        this.position = initialPosition;
        this.quaternion = this._getQuaternionByPosition(this.position);

        this.currentMousePos = new Vector([0, 0]);
        this.accountedMousePos = new Vector([0, 0]);

        this.threeCamera.position.fromArray([0, 0, 0]);

        domElement.addEventListener('mousedown', function (event) {
            that.onMouseDown(event);
        });
        domElement.addEventListener('mousemove', function (event) {
            that.onMouseMove(event);
        });
        domElement.addEventListener('mouseup', function (event) {
            that.onMouseUp(event);
        });
        domElement.addEventListener('wheel', function (event) {
            that.onMouseWheel(event);
        });
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
            .add_(TRAJECTORIES[this.orbitingPoint].getPositionByEpoch(this.lastEpoch, RF_BASE))
            .sub_(TRAJECTORIES[pointId].getPositionByEpoch(this.lastEpoch, RF_BASE));
        this.quaternion = this._getQuaternionByPosition(this.position);
        this.orbitingPoint = pointId;
    }

    getOrbitingPointPosition(epoch) {
        return TRAJECTORIES[this.orbitingPoint].getPositionByEpoch(epoch, RF_BASE);
    }

    onMouseWheel(event) {
        const koeff = 1.5;
        if (event.deltaY < 0) {
            this.position.scale(1 / koeff);
        } else if (event.deltaY > 0) {
            this.position.scale(koeff);
        }
    }

    onMouseDown(event) {
        this.accountedMousePos = new Vector([event.clientX, event.clientY]);
        this.currentMousePos = Vector.copy(this.accountedMousePos);
        this.isMouseDown = true;
    }

    onMouseMove(event) {
        if (this.isMouseDown) {
            this.currentMousePos.set(event.clientX, event.clientY);
        }
    }

    onMouseUp(event) {
        this.isMouseDown = false;
    }

    onResize() {
        this.threeCamera.aspect = this.domElement.width / this.domElement.height;
        this.threeCamera.updateProjectionMatrix();
    }

    update(epoch) {
        let mouseShift = this.currentMousePos.sub(this.accountedMousePos);

        if (mouseShift[0] || mouseShift[1]) {
            let poleAngle = this.position.angle(this.pole);
            let verticalRotationAxis = this.position.cross(this.pole);
            let verticalQuaternion = new Quaternion(verticalRotationAxis, Math.max(Math.min(mouseShift[1] * 0.01, poleAngle), poleAngle - Math.PI));
            let mainQuaternion = (new Quaternion()).setAxisAngle(this.pole, -mouseShift[0] * 0.01).mul(verticalQuaternion);

            mainQuaternion.rotate_(this.position);
            this.quaternion = mainQuaternion.mul(this.quaternion);

            this.accountedMousePos = Vector.copy(this.currentMousePos);
        }

        this.threeCamera.quaternion.copy(this.quaternion.toThreejs());
        this.lastPosition = this.getOrbitingPointPosition(epoch).add_(this.position);
        this.lastEpoch = epoch;
    }
}