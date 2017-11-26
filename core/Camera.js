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

        this.currentMousePos = new Vector([0, 0]);
        this.accountedMousePos = new Vector([0, 0]);

        this.threeCamera = new THREE.PerspectiveCamera(this.settings.fov, domElement.width / domElement.height, 1, 1e15);
        this.threeCamera.position.fromArray([0, 0, 0]);

        this.isMouseDown = false;
        this.rightButtonDown = false;
        this.isLookingAside = true;
        this.zoomingAside = 0;
        this.isAnimnating = false;

        sim.addEventListener('mousedown', this.onMouseDown.bind(this) , 1);
        sim.addEventListener('mousemove', this.onMouseMove.bind(this) , 1);
        sim.addEventListener('mouseup',   this.onMouseUp.bind(this)   , 1);
        sim.addEventListener('wheel',     this.onMouseWheel.bind(this), 1);
    }

    getPoleVector() {
        if (sim.starSystem.getObject(this.orbitingPoint) instanceof Body) {
            return sim.starSystem.getObject(this.orbitingPoint).orientation.getQuaternionByEpoch(sim.currentEpoch).rotate_(new Vector([0, 0, 1]));
        } else {
            return new Vector([0, 0, 1]);
        }
    }

    updatePole() {
        this.pole = this.getPoleVector();
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
            position.cross(pole),
            Math.PI / 2
        ).rotate(position);

        let rollQuaternion = (new Quaternion()).setAxisAngle(
            newUp.cross(neededUp),
            Math.acos(newUp.dot(neededUp) / neededUp.mag)
        );

        return rollQuaternion.mul(directionQuaternion);
    }

    setOrbitingPoint(pointId, animate) {
        this.position
            .add_(sim.starSystem.getTrajectory(this.orbitingPoint).getPositionByEpoch(sim.currentEpoch, RF_BASE))
            .sub_(sim.starSystem.getTrajectory(pointId).getPositionByEpoch(sim.currentEpoch, RF_BASE));
        this.orbitingPoint = pointId;
        this.isLookingAside = false;
        this.zoomingAside = 0;

        sim.settings.trackingObject = pointId;

        if (!animate) {
            this.updatePole();
            this.quaternion = this._getQuaternionByPosition(this.position, this.pole);
            this.isLookingAside = false;
        } else {
            this.startAnimation();
        }

        sim.ui.updateTarget(pointId);
    }

    startAnimation() {
        this.animationStartingTime = (new Date()).getTime();
        this.animationDuration = this.settings.animationDuration;
        this.animationStartingPole = this.pole.copy();
        this.animationStartingQuaternion = this.quaternion.copy();
        this.isAnimnating = true;
    }

    animate() {
        const time = (new Date()).getTime();
        const percent = (time - this.animationStartingTime) / this.animationDuration;
        const targetPole = this.getPoleVector();
        const targetQuat = this._getQuaternionByPosition(this.position, targetPole);

        if (percent >= 1) {
            this.pole = targetPole;
            this.quaternion = targetQuat;
            this.isAnimnating = false;
            this.isLookingAside = false;
            return;
        }

        const poleTargetQuat = Quaternion.transfer(this.animationStartingPole, targetPole);
        const poleQuat = Quaternion.slerp(new Quaternion(), poleTargetQuat, percent);

        this.pole = poleQuat.rotate(this.animationStartingPole);
        this.quaternion = Quaternion.slerp(this.animationStartingQuaternion, targetQuat, percent);
    }

    getOrbitingPointPosition(epoch) {
        return sim.starSystem.getTrajectory(this.orbitingPoint).getPositionByEpoch(epoch, RF_BASE);
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
            this.position
                .add_(sim.starSystem.getTrajectory(this.orbitingPoint).getPositionByEpoch(sim.currentEpoch, RF_BASE))
                .sub_(sim.starSystem.getTrajectory(objectToZoomTo).getPositionByEpoch(sim.currentEpoch, RF_BASE));
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
            this.position
                .add_(sim.starSystem.getTrajectory(objectToZoomTo).getPositionByEpoch(sim.currentEpoch, RF_BASE))
                .sub_(sim.starSystem.getTrajectory(this.orbitingPoint).getPositionByEpoch(sim.currentEpoch, RF_BASE));
            this.isLookingAside = true;
            this.zoomingAside++;

        } else if (this.isLookingAside) {
            this.startAnimation();
        }

        if (this.zoomingAside === 3) {
            this.setOrbitingPoint(objectToZoomTo, true);
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
        let mouseShift = this.currentMousePos.sub(this.accountedMousePos);

        if (this.isAnimnating) {
            this.animate()
        } else {
            this.updatePole();
        }

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

            this.accountedMousePos = this.currentMousePos.copy();
        }
        this.threeCamera.quaternion.copy(this.quaternion.toThreejs());
        this.lastPosition = this.getOrbitingPointPosition(epoch).add_(this.position);
    }
}
