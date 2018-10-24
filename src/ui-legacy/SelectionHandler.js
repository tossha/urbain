import * as THREE from "three";

import VisualModelAbstract from "../core/visual/ModelAbstract";
import { sim, Events } from "../core/index";

export default class SelectionHandler extends VisualModelAbstract
{
    constructor() {
        super();

        this.selectableObjects = [];

        this.selectedObject = null;
        this.bestIntersection = null;

        this.selectionMouseButton = 0;
        this.pointSize = 5;

        this.setThreeObj(new THREE.Mesh(
            new THREE.SphereGeometry(1, 10, 10),
            new THREE.MeshBasicMaterial({color: 0xFFFF00})
        ));

        sim.addEventListener('click', this.onMouseClick.bind(this), 1);
        sim.addEventListener('mousedown', this.onMouseDown.bind(this), 1);

        this.mouseMoveListener = this.onMouseMove.bind(this);
    }

    /**
     *
     * @param object - must be a three.js object with its userData.selectionObject
     *                 property set to object (or a function returning that object)
     *                 that will be selected (and its select() method will be called)
     */
    addSelectableObject(object) {
        this.selectableObjects.push(object);
    }

    removeSelectableObject(object) {
        for (let i in this.selectableObjects) {
            if (this.selectableObjects[i] === object) {
                delete this.selectableObjects[i];
                break;
            }
        }
        this.selectableObjects = this.selectableObjects.filter(val => val);
    }

    render() {
        const intersections = sim.raycaster.intersectObjects(this.selectableObjects);

        if (intersections.length > 0) {
            this.bestIntersection = intersections[0];

            for(var i = 1; i < intersections.length; i++) {
                if (intersections[i].distance < this.bestIntersection.distance) {
                    this.bestIntersection = intersections[i];
                }
            }

            this.threeObj.visible = true;
            this.threeObj.position.copy(this.bestIntersection.point);

            const scaleKoeff = this.pointSize * this.bestIntersection.point.length() * sim.raycaster.getPixelAngleSize();

            this.threeObj.scale.x = scaleKoeff;
            this.threeObj.scale.y = scaleKoeff;
            this.threeObj.scale.z = scaleKoeff;
        }
        else {
            this.threeObj.visible = false;
            this.bestIntersection = null;
        }
    }

    onMouseDown(event) {
        if (event.button === this.selectionMouseButton) {
            document.addEventListener('mousemove', this.mouseMoveListener);
            this.hasMouseMoved = false;
            this.mouseClickStart = [event.clientX, event.clientY];
        }
    }

    onMouseMove(event) {
        if (this.mouseClickStart[0] !== event.clientX || this.mouseClickStart[1] !== event.clientY) {
            this.hasMouseMoved = true;
        }
    }

    onMouseClick(event) {
        const wasSelected = this.selectedObject;

        if (event.button !== this.selectionMouseButton) {
            return;
        }

        document.removeEventListener('mousemove', this.mouseMoveListener);

        if (this.hasMouseMoved) {
            return;
        }

        this.deselect();

        if (this.bestIntersection) {
            let selectionObject = this.bestIntersection.object.userData.selectionObject;
            if (selectionObject instanceof Function) {
                selectionObject = selectionObject();
            }
            if (selectionObject && selectionObject !== wasSelected) {
                this.select(selectionObject);
            }
        }
    }

    forceSelection(object) {
        this.deselect();
        this.select(object);
    }

    getSelectedObject() {
        return this.selectedObject;
    }

    select(object) {
        this.selectedObject = object;
        this.selectedObject.select();

        Events.dispatch(Events.SELECT, {object: this.selectedObject});
    }

    deselect() {
        if (!this.selectedObject) {
            return;
        }

        Events.dispatch(Events.DESELECT, {object: this.selectedObject});

        this.selectedObject.deselect();
        this.selectedObject = null;
    }
}
