import * as THREE from "three";
import VisualModelAbstract from "./ModelAbstract";
import {RF_BASE, RF_BASE_OBJ} from "../ReferenceFrame/Factory";
import VirtualPlane from "./VirtualPlane";
import {Vector} from "../algebra";
import { sim } from "../simulation-engine";

export default class VisualPlanePoint extends VisualModelAbstract
{
    constructor(referenceFrame, value, color, size, editingCallback, minBound, maxBound) {
        super();

        this._referenceFrame = referenceFrame;
        this._value = value;
        this.color = color;
        this.size = size;
        this.editingCallback = editingCallback;
        this.minBound = minBound;
        this.maxBound = maxBound;

        this.isEditMode = !!editingCallback;

        this.lastEpoch = 0;

        this.init();
    }

    getReferenceFrame(epoch) {
        return this._referenceFrame.evaluate(epoch);
    }

    init() {
        this.setThreeObj(new THREE.Mesh(
            new THREE.SphereGeometry(1, 8, 8),
            new THREE.MeshBasicMaterial({color: this.color})
        ));

        if (this.isEditMode) {
            this.mouseDownListener = this.onMouseDown.bind(this);
            document.addEventListener('mousedown', this.mouseDownListener);
        }
    }

    drop() {
        super.drop();
        if (this.mouseDownListener) {
            document.removeEventListener('mousedown', this.mouseDownListener);
        }
    }

    onMouseDown(event) {
        if (event.button != 0) {
            return;
        }

        let intersection = sim.raycaster.intersectObjects([this.threeObj])[0];
        if (intersection && (event.button == 0)) { //check if the mouse button pressed is left
            this.mouseUpListener = this.onMouseUp.bind(this);
            document.addEventListener('mouseup', this.mouseUpListener);
            this.mouseMoveListener = this.onMouseMove.bind(this);
            sim.addEventListener('mousemove', this.mouseMoveListener, 3);
        }
    }

    onMouseUp(event) {
        document.removeEventListener('mouseup', this.mouseUpListener);
        sim.removeEventListener('mousemove', this.mouseMoveListener);
    }

    onMouseMove() {
        this.updateValue(this.lastEpoch);
    }

    updateValue(epoch) {
        const plane = this.getVirtualPlane(epoch);
        let intersection = sim.raycaster.intersectObjects([plane])[0];
        if (intersection) {
            const minBound = this.minBound(epoch);
            const maxBound = this.maxBound(epoch);
            this._value = RF_BASE_OBJ.transformPositionByEpoch(epoch, sim.getSimCoords(intersection.point), this.getReferenceFrame(epoch));

            for (let idx of [0,1,2]) {
                if (minBound[idx] !== false && this._value[idx] < minBound[idx]) {
                    this._value[idx] = minBound[idx];
                } else if (maxBound[idx] !== false && this._value[idx] > maxBound[idx]) {
                    this._value[idx] = maxBound[idx];
                }
            }

            if (this.editingCallback) {
                this.editingCallback(this._value);
            }
        }
    }

    getVirtualPlane(epoch) {
        const normal = (new THREE.Vector3()).fromArray(this.getReferenceFrame(epoch).getQuaternionByEpoch(epoch).rotate_(new Vector([0,0,1])));
        const position = sim.getVisualCoords(this.getReferenceFrame(epoch).getOriginPositionByEpoch(epoch));
        const angle = Math.acos(normal.dot(position) / position.length() / normal.length());
        const distance = position.length() * Math.cos(angle);

        if (this.virtualPlane) {
            this.virtualPlane.normal.copy(normal);
            this.virtualPlane.constant = distance;
        } else {
            this.virtualPlane = new VirtualPlane(normal, distance);
        }

        return this.virtualPlane;
    }

    render(epoch) {
        this.lastEpoch = epoch;

        this.setPosition(this.getReferenceFrame(epoch).transformPositionByEpoch(
            epoch,
            this._value,
            RF_BASE
        ));

        const scaleKoeff = this.size * this.threeObj.position.length() * this.pixelAngleSize;
        this.threeObj.scale.x = scaleKoeff;
        this.threeObj.scale.y = scaleKoeff;
        this.threeObj.scale.z = scaleKoeff;
    }
}
