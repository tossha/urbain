class Camera
{
    constructor(domElement, initialReferenceFrame, initialPosition) {
        this.settings = {
            fov: 60,
            animationDuration: 200,
            zoomFactor: 1.5,
            pixelsToObjectUnderMouse: 20
        };

        this.domElement = domElement;
        this.position = initialPosition;

        this.referenceFrame = sim.starSystem.getReferenceFrame(initialReferenceFrame);
        this.orbitingPoint = this.referenceFrame.originId;
        this.frameType = this.referenceFrame.type;
        this.quaternion = this._getQuaternionByPosition(this.position);

        this.currentMousePos = new Vector([0, 0]);
        this.accountedMousePos = new Vector([0, 0]);

        this.threeCamera = new THREE.PerspectiveCamera(this.settings.fov, domElement.width / domElement.height, 1, 1e15);
        this.threeCamera.position.fromArray([0, 0, 0]);

        this.isMouseDown = false;
        this.rightButtonDown = false;
        this.isLookingAside = false;
        this.zoomingAside = 0;
        this.isAnimnating = false;

        sim.addEventListener('mousedown', this.onMouseDown.bind(this) , 1);
        sim.addEventListener('mousemove', this.onMouseMove.bind(this) , 1);
        sim.addEventListener('mouseup',   this.onMouseUp.bind(this)   , 1);
        sim.addEventListener('wheel',     this.onMouseWheel.bind(this), 1);
    }

    _getQuaternionByPosition(position, pole) {
        const defaultDirection = new Vector([0, 0, 1]); // must be unit length
        const defaultUp = new Vector([0, 1, 0]);        // must be unit length

        const directionQuaternion = (new Quaternion()).setAxisAngle(
            defaultDirection.cross(position),
            Math.acos(position.dot(defaultDirection) / position.mag)
        );

        const newUp = directionQuaternion.rotate(defaultUp);
        const neededUp = (new Quaternion()).setAxisAngle(
            position.cross(pole || new Vector([0, 0, 1])),
            Math.PI / 2
        ).rotate(position);

        let rollQuaternion = (new Quaternion()).setAxisAngle(
            newUp.cross(neededUp),
            Math.acos(newUp.dot(neededUp) / neededUp.mag)
        );

        return rollQuaternion.mul(directionQuaternion);
    }

    changeReferenceFrameType(newType) {
        this.changeReferenceFrame(sim.starSystem.getObjectReferenceFrameId(this.orbitingPoint, newType), true);
    }

    changeOrigin(newObjectId) {
        this.changeReferenceFrame(sim.starSystem.getObjectReferenceFrameId(newObjectId, this.frameType), true);
    }

    changeReferenceFrame(newFrameId, animate) {
        let newFrame = sim.starSystem.getReferenceFrame(newFrameId);

        if (newFrame === null) {
            newFrame = sim.starSystem.getReferenceFrame(
                sim.starSystem.getObjectReferenceFrameId(
                    sim.starSystem.getReferenceFrameIdObject(newFrameId),
                    ReferenceFrame.INERTIAL_ECLIPTIC
                )
            );

        }

        this.position = this.referenceFrame.transformPositionByEpoch(sim.currentEpoch, this.position, newFrame);
        this.isLookingAside = false;
        this.zoomingAside = 0;
        this.orbitingPoint = newFrame.originId;
        this.frameType = newFrame.type;
        sim.ui.updateFrameType(this.frameType);

        if (animate) {
            this.startAnimation(newFrame);
        } else {
            this.quaternion = this._getQuaternionByPosition(this.position);
        }

        this.referenceFrame = newFrame;

        sim.ui.updateTarget(this.referenceFrame.originId);
    }

    startAnimation(newFrame) {
        if (newFrame) {
            let transferQuaternion = this.referenceFrame.getQuaternionByEpoch(sim.currentEpoch).invert_().mul_(newFrame.getQuaternionByEpoch(sim.currentEpoch));
            this.quaternion = transferQuaternion.invert_().mul(this.quaternion);
        }

        this.animationStartingTime = (new Date()).getTime();
        this.animationDuration = this.settings.animationDuration;
        this.animationStartingQuaternion = this.quaternion.copy();
        this.isAnimnating = true;
    }

    animate() {
        const time = (new Date()).getTime();
        const percent = (time - this.animationStartingTime) / this.animationDuration;
        const targetQuat = this._getQuaternionByPosition(this.position);

        if (percent >= 1) {
            this.quaternion = targetQuat;
            this.isAnimnating = false;
            this.isLookingAside = false;
            return;
        }

        this.quaternion = Quaternion.slerp(this.animationStartingQuaternion, targetQuat, percent);
    }

    findObjectUnderMouse() {
        let biggestRadius = 0;
        let biggestObject = false;
        for (const body of sim.starSystem.getBodies()) {
            const dist = sim.raycaster.getPixelDistance(
                body.getPositionByEpoch(sim.currentEpoch, RF_BASE)
            );
            if (dist < this.settings.pixelsToObjectUnderMouse) {
                if (biggestObject === false) {
                    biggestObject = body.id;
                }
                const r = body.physicalModel.radius;
                if (r && r > biggestRadius) {
                    biggestRadius = r;
                    biggestObject = body.id;
                }
            }
        }
        return biggestObject;
    }

    onMouseWheel(event) {
        if (!event.deltaY) {
            return;
        }

        const factor = event.deltaY < 0
            ? 1 / this.settings.zoomFactor
            : this.settings.zoomFactor;
        let objectToZoomTo = this.findObjectUnderMouse();
        let zoomingTo = this.orbitingPoint;

        if (objectToZoomTo === this.orbitingPoint) {
            objectToZoomTo = false;
        }

        if (objectToZoomTo !== false) {
            this.position = this.referenceFrame.transformPositionByEpoch(sim.currentEpoch, this.position, objectToZoomTo * 100000 + 1000);
            zoomingTo = objectToZoomTo;
        } else {
            this.zoomingAside = 0;
        }

        if (sim.starSystem.getObject(zoomingTo).physicalModel && sim.starSystem.getObject(zoomingTo).physicalModel.radius) {
            const currentMag = this.position.mag;
            this.position.mul_((sim.starSystem.getObject(zoomingTo).physicalModel.radius + (currentMag - sim.starSystem.getObject(zoomingTo).physicalModel.radius) * factor) / currentMag);
        } else {
            this.position.mul_(factor);
        }

        if (objectToZoomTo !== false) {
            this.position = sim.starSystem.getReferenceFrame(objectToZoomTo * 100000 + 1000).transformPositionByEpoch(sim.currentEpoch, this.position, this.referenceFrame);
            this.isLookingAside = true;
            this.zoomingAside++;

        } else if (this.isLookingAside) {
            this.startAnimation();
        }

        if (this.zoomingAside === 3) {
            this.changeOrigin(objectToZoomTo, true);
        }
    }

    onMouseDown(event) {
        this.accountedMousePos = new Vector([event.clientX, event.clientY]);
        this.currentMousePos = this.accountedMousePos.copy();
        this.isMouseDown = true;
        switch (event.button) {
            case 0: //left
                break;
            case 1: // middle
                break;
            case 2:
                this.rightButtonDown = true;
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
        const rfQuaternion = this.referenceFrame.getQuaternionByEpoch(epoch);
        let mouseShift = this.currentMousePos.sub(this.accountedMousePos);

        if (this.isAnimnating) {
            this.animate()
        }

        if (mouseShift[0] || mouseShift[1]) {
            const polarConstraint = 0.00001;
            const pole = new Vector([0, 0, 1]);
            let poleAngle = this.position.angle(pole);
            let verticalRotationAxis = this.rightButtonDown
                ? this.quaternion.rotate(new Vector([0, 0, 1])).cross(pole)
                : this.position.cross(pole);

            let verticalQuaternion = new Quaternion(verticalRotationAxis, Math.min(Math.max(mouseShift[1] * 0.01, poleAngle - Math.PI + polarConstraint), poleAngle - polarConstraint));
            let mainQuaternion = (new Quaternion()).setAxisAngle(pole, -mouseShift[0] * 0.01).mul_(verticalQuaternion);

            if (!this.rightButtonDown) {
                mainQuaternion.rotate_(this.position);
            }
            this.quaternion = mainQuaternion.mul_(this.quaternion);

            this.accountedMousePos = this.currentMousePos.copy();
        }
        this.threeCamera.quaternion.copy(rfQuaternion.mul_(this.quaternion).toThreejs());
        this.lastPosition = this.referenceFrame.transformPositionByEpoch(epoch, this.position, RF_BASE);
    }
}

Camera.selectableReferenceFrameTypes = {
    [ReferenceFrame.INERTIAL_ECLIPTIC]: 'Ecliptic',
    [ReferenceFrame.INERTIAL_BODY_EQUATORIAL]: 'Equatorial',
    [ReferenceFrame.INERTIAL_BODY_FIXED]: 'Body fixed',
};