import * as THREE from "three";

import {Quaternion, Vector} from "../core/algebra";
import {ReferenceFrame, RF_BASE} from "../core/ReferenceFrame/Factory";
import Events from "../core/Events";
import ReferenceFrameFactory from "../core/ReferenceFrame/Factory";

export default class Camera
{
    /**
     * @param domElement
     * @param {SimulationEngine} sim
     */
    constructor(domElement, sim) {
        this.settings = {
            fov: 60,
            animationDuration: 200,
            pixelsToObjectUnderMouse: 20
        };

        this.domElement = domElement;
        this.threeCamera = new THREE.PerspectiveCamera(this.settings.fov, domElement.width / domElement.height, 1, 1e15);
        this.threeCamera.position.fromArray([0, 0, 0]);

        this.listenersAdded = false;
        this._sim = sim;
    }

    init(initialReferenceFrame, initialPosition) {
        this.position = initialPosition;

        this.referenceFrame = this._sim.starSystem.getReferenceFrame(initialReferenceFrame);
        this.orbitingPoint = this.referenceFrame.originId;
        this.frameType = this.referenceFrame.type;
        this.quaternion = this._getQuaternionByPosition(this.position);

        this.lastPosition = this.referenceFrame.transformPositionByEpoch(this._sim.currentEpoch, this.position, RF_BASE);

        this.currentMousePos = new Vector([0, 0]);
        this.accountedMousePos = new Vector([0, 0]);

        this.isMouseDown = false;
        this.isShiftDown = false;
        this.rightButtonDown = false;
        this.isLookingAside = false;
        this.zoomingAside = 0;
        this.isAnimnating = false;

        if (!this.listenersAdded) {
            this._sim.addEventListener('mousedown', this.onMouseDown.bind(this), 1);
            this._sim.addEventListener('mousemove', this.onMouseMove.bind(this), 1);
            this._sim.addEventListener('mouseup', this.onMouseUp.bind(this), 1);
            this._sim.addEventListener('wheel', this.onMouseWheel.bind(this), 1);
            this.listenersAdded = true;
        }
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

        return rollQuaternion.mul_(directionQuaternion);
    }

    getAvailableFrameTypes(orbitingPoint) {
        if (orbitingPoint === undefined) {
            orbitingPoint = this.orbitingPoint;
        }

        if (orbitingPoint == 0) {
            return [ReferenceFrame.INERTIAL_ECLIPTIC];
        }

        const isBody = this._sim.starSystem.isBody(orbitingPoint);

        if (isBody === null) {
            return [];
        } else if (isBody) {
            return [
                ReferenceFrame.INERTIAL_ECLIPTIC,
                ReferenceFrame.INERTIAL_BODY_EQUATORIAL,
                ReferenceFrame.INERTIAL_BODY_FIXED
            ];
        } else {
            return [
                ReferenceFrame.INERTIAL_ECLIPTIC,
                ReferenceFrame.INERTIAL_PARENT_BODY_EQUATORIAL
            ];
        }
    }

    changeReferenceFrameType(newType) {
        this.changeReferenceFrame(ReferenceFrameFactory.buildId(this.orbitingPoint, newType), true);
    }

    changeOrigin(newObjectId) {
        const newFrameTypes = this.getAvailableFrameTypes(newObjectId);
        let newFrameType = (newFrameTypes.indexOf(this.frameType) !== -1)
            ? this.frameType
            : ReferenceFrame.INERTIAL_ECLIPTIC;
        this.changeReferenceFrame(ReferenceFrameFactory.buildId(newObjectId, newFrameType), true);
    }

    changeReferenceFrame(newFrameId, animate) {
        const newFrame = this._sim.starSystem.getReferenceFrame(newFrameId);

        this.position = this.referenceFrame.transformPositionByEpoch(this._sim.currentEpoch, this.position, newFrame);
        this.isLookingAside = false;
        this.zoomingAside = 0;
        this.orbitingPoint = newFrame.originId;
        this.frameType = newFrame.type;

        if (animate) {
            this.startAnimation(newFrame);
        } else {
            this.quaternion = this._getQuaternionByPosition(this.position);
        }

        Events.dispatch(Events.CAMERA_RF_CHANGED, {old: this.referenceFrame, new: newFrame});

        this.referenceFrame = newFrame;
    }

    startAnimation(newFrame) {
        if (newFrame) {
            let transferQuaternion = this.referenceFrame.getQuaternionByEpoch(this._sim.currentEpoch).invert_().mul_(newFrame.getQuaternionByEpoch(this._sim.currentEpoch));
            this.quaternion = transferQuaternion.invert_().mul_(this.quaternion);
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
        for (const body of this._sim.starSystem.getBodies()) {
            const dist = this._sim.raycaster.getPixelDistance(
                body.getPositionByEpoch(this._sim.currentEpoch, RF_BASE)
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

        const defaultFactor = event.shiftKey ? (1 + (this._sim.settings.ui.camera.zoomFactor - 1) / 10) : this._sim.settings.ui.camera.zoomFactor;
        const factor = event.deltaY < 0
            ? 1 / defaultFactor
            : defaultFactor;
        let objectToZoomTo = this.findObjectUnderMouse();
        let zoomingTo = this.orbitingPoint;

        if (objectToZoomTo === this.orbitingPoint) {
            objectToZoomTo = false;
        }

        if (objectToZoomTo !== false) {
            this.position = this.referenceFrame.transformPositionByEpoch(this._sim.currentEpoch, this.position, objectToZoomTo * 100000 + 1000);
            zoomingTo = objectToZoomTo;
        } else {
            this.zoomingAside = 0;
        }

        if (this._sim.starSystem.getObject(zoomingTo).physicalModel && this._sim.starSystem.getObject(zoomingTo).physicalModel.radius) {
            const currentMag = this.position.mag;
            this.position.mul_((this._sim.starSystem.getObject(zoomingTo).physicalModel.radius + (currentMag - this._sim.starSystem.getObject(zoomingTo).physicalModel.radius) * factor) / currentMag);
        } else {
            this.position.mul_(factor);
        }

        if (objectToZoomTo !== false) {
            this.position = this._sim.starSystem.getReferenceFrame(objectToZoomTo * 100000 + 1000).transformPositionByEpoch(this._sim.currentEpoch, this.position, this.referenceFrame);
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
            default:
                break;
        }
    }

    onMouseMove(event) {
        if (this.isMouseDown) {
            this.isShiftDown = !!event.shiftKey;
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

    getTopDirection(epoch) {
        return this.referenceFrame.getQuaternionByEpoch(epoch).mul_(this.quaternion).rotate_(new Vector([0,1,0]));
    }

    update(epoch) {
        const rfQuaternion = this.referenceFrame.getQuaternionByEpoch(epoch);
        let mouseShift = this.currentMousePos.sub(this.accountedMousePos);

        if (this.isAnimnating) {
            this.animate();
        }

        if (mouseShift[0] || mouseShift[1]) {
            const polarConstraint = 0.00001;
            const sensitivity = (this.isShiftDown ? 0.1 : 1) * this._sim.settings.ui.camera.mouseSensitivity;
            const pole = new Vector([0, 0, 1]);
            let poleAngle = this.position.angle(pole);
            let verticalRotationAxis = this.rightButtonDown
                ? this.quaternion.rotate(new Vector([0, 0, 1])).cross(pole)
                : this.position.cross(pole);

            let verticalQuaternion = new Quaternion(verticalRotationAxis, Math.min(Math.max(mouseShift[1] * sensitivity, poleAngle - Math.PI + polarConstraint), poleAngle - polarConstraint));
            let mainQuaternion = (new Quaternion(pole, -mouseShift[0] * sensitivity)).mul_(verticalQuaternion);

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
