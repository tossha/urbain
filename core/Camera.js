class Camera
{
    constructor (threeCamera, domElement) {
        let that = this;

        this.threeCamera = threeCamera;
        this.domElement = domElement;
        this.isMouseDown = false;
        this.orbitingPoint = SUN;

        this.position = new Vector([1000000, 1000000, 1000000]);
        this.position = new Vector([0, -3000000, 0]);
        this.quaternion = (new Quaternion()).setAxisAngle([1, 0, 0], 0);
        this.quaternion = (new Quaternion()).setAxisAngle([1, 0, 0], Math.PI / 2);
        this.pole = new Vector([0, 0, 1]);

        this.currentMousePos = new Vector([0, 0]);
        this.accountedMousePos = new Vector([0, 0]);

        domElement.addEventListener('mousedown', function (event) {
            that.onMouseDown(event);
        });
        domElement.addEventListener('mousemove', function (event) {
            that.onMouseMove(event);
        });
        domElement.addEventListener('mouseup', function (event) {
            that.onMouseUp(event);
        });
    }

    setObitingPoint(pointId) {
        this.orbitingPoint = pointId;
    }

    getOrbitingPointPosition(epoch) {
        return TRAJECTORIES[this.orbitingPoint].getPositionByEpoch(epoch, RF_BASE);
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

    update(epoch) {
        let mouseShift = this.currentMousePos.sub(this.accountedMousePos);

        if (mouseShift[0] || mouseShift[1]) {
            let verticalRotationAxis = this.position.cross(this.pole);
            let verticalQuaternion = (new Quaternion()).setAxisAngle(verticalRotationAxis, mouseShift[1] * 0.01);
            let mainQuaternion = (new Quaternion()).setAxisAngle(this.pole, -mouseShift[0] * 0.01).mul(verticalQuaternion);

            this.position = mainQuaternion.rotate(this.position);
            this.quaternion = mainQuaternion.mul(this.quaternion);

            this.accountedMousePos = Vector.copy(this.currentMousePos);
        }

        this.threeCamera.quaternion.copy(this.quaternion.toThreejs());
        this.threeCamera.position.fromArray(this.getOrbitingPointPosition(epoch).add_(this.position));
    }
}