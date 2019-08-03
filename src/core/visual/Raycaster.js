import * as THREE from "three";

import { deg2rad } from "../algebra";

export default class VisualRaycaster {
    /**
     * @param {SimulationEngine} simulationEngine
     * @param domElement
     * @param threeCamera
     * @param pixelPrecision
     */
    constructor(simulationEngine, domElement, threeCamera, pixelPrecision) {
        this._simulationEngine = simulationEngine;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.camera = threeCamera;
        this.domElement = domElement;

        this.setPixelPrecision(pixelPrecision);
        this.updatePixelAngleSize();

        this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.domElement.addEventListener('resize', this.updatePixelAngleSize.bind(this));
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / this.domElement.width) * 2 - 1;
        this.mouse.y = -(event.clientY / this.domElement.height) * 2 + 1;
    }

    setPixelPrecision(value) {
        this.raycaster.pixelPrecision = value;
    }

    updatePixelAngleSize() {
        this.raycaster.pixelAngleSize = deg2rad(this.camera.fov) / this.domElement.height;
    }

    getPixelAngleSize() {
        return this.raycaster.pixelAngleSize;
    }

    intersectObjects(threeObjects) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        return this.raycaster.intersectObjects(threeObjects);
    }

    getPixelDistance(point) {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const pointDirection = (new THREE.Vector3()).subVectors(
            point,
            this._simulationEngine.camera.lastPosition
        );

        const angle = Math.acos(
            this.raycaster.ray.direction.dot(pointDirection) / pointDirection.length()
        );

        return angle / this.raycaster.pixelAngleSize;
    }
}
