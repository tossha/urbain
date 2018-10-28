import * as THREE from "three";

import VisualModelAbstract from "../ModelAbstract";
import LineObject from "../LineObject";
import { sim } from "../../Simulation";

export default class VisualTrajectoryAbstract extends VisualModelAbstract
{
    /**
     * @param trajectory {TrajectoryAbstract}
     * @param config {Object} Fields:
     *      color            - base color of the trajectory
     *      selectedColor    - color when selected
     *      minEpoch/        - (float)   epoch, trajectory is not rendered before/after this moment.
     *      maxEpoch           (false)   there's no limit. for times before/after
     *                                   minEpoch/maxEpoch of the trajectory, minEpoch/maxEpoch
     *                                   of the trajectory is used.
     *                         ('copy')  minEpoch/maxEpoch of the trajectory is used
     */
    constructor(trajectory, config) {
        super();

        this.trajectory = trajectory;
        this.color = config.color;
        this.config = config;

        this.initFlightEvents();

        this._markers = {};
        this._defaultMarkerScale  = 0.5;
        this._selectedMarkerScale = 1;

        this._minEpoch = (config.minEpoch !== undefined) ? config.minEpoch : (trajectory.minEpoch || false);
        this._maxEpoch = (config.maxEpoch !== undefined) ? config.maxEpoch : (trajectory.maxEpoch || false);

        if (this.constructor.NO_THREE_OBJ) {
            return;
        }

        this.setThreeObj(new LineObject(
            new THREE.Geometry(),
            new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors})
        ));

        this.point = new THREE.Mesh(
            new THREE.SphereGeometry(1, 8, 8),
            new THREE.MeshBasicMaterial({color: this.color})
        );
        this.scene.add(this.point);
        this.pointSize = 4;

        this.threeObj.userData = {selectionObject: () => this.trajectory.object};
        sim.selection.addSelectableObject(this.threeObj);
    }

    get minEpoch() {
        return (this._minEpoch === 'copy')
            ? this.trajectory.minEpoch
            : this._minEpoch;
    }

    get maxEpoch() {
        return (this._maxEpoch === 'copy')
            ? this.trajectory.maxEpoch
            : this._maxEpoch;
    }

    getEpochByPoint(point) {
        return null;
    }

    /**
     *
     * @param handler {Function} - this function is called when user clicks on the trajectory.
     *                             Epoch that corresponds to the point under the mouse is passed
     *                             as the only argument.
     */
    onClick(handler) {
        this.threeObj.userData.onClick = (intersection) => handler(
            this.getEpochByPoint(sim.getSimCoords(intersection.point))
        );
    }

    initFlightEvents() {
        this.flightEvents = [];
        for (let event of this.trajectory.flightEvents) {
            this.addFlightEvent(event);
        }
    }

    addFlightEvent(flightEvent) {
        const className = flightEvent.getVisualClass();
        if (!className) {
            return;
        }
        
        let model = new className(this.trajectory, flightEvent, this.color);
        if (!this.trajectory.isSelected) {
            model.setScale(0.5);
        }
        flightEvent.visualModel = model;
        this.flightEvents.push({
            event: flightEvent,
            model: model
        });
    }

    removeFlightEvent(flightEvent) {
        for (let i in this.flightEvents) {
            if (this.flightEvents[i].event === flightEvent) {
                this.flightEvents[i].model.drop();
                this.flightEvents.splice(i, 1);
                break;
            }
        }
    }

    updateGeometry(points, colorMults, endingBrightness) {
        const mainColor = new THREE.Color(this.color);
        this.threeObj.geometry.dispose();
        this.threeObj.geometry = (new THREE.Geometry()).setFromPoints(points);

        for (let i = 0; i < colorMults.length; i++) {
            let curColor = (new THREE.Color()).copy(mainColor);
            const mult = endingBrightness + (1 - endingBrightness) * colorMults[i];

            this.threeObj.geometry.colors.push(
                curColor.multiplyScalar(mult)
            );
        }
    }

    /**
     * Returns moment in time to use to calculate position
     * of the spacecraft relative to its reference frame.
     * false means the trajectory is not rendered.
     * @param epoch
     * @returns {*}
     */
    getPositionEpoch(epoch) {
        if ((this.minEpoch !== false && epoch < this.minEpoch)
            || (this.maxEpoch !== false && epoch > this.maxEpoch)
        ) {
            return false;
        }

        if (this.trajectory.minEpoch !== false && epoch < this.trajectory.minEpoch) {
            return this.trajectory.minEpoch;
        }
        if (this.trajectory.maxEpoch !== false && epoch > this.trajectory.maxEpoch) {
            return this.trajectory.maxEpoch;
        }

        return epoch;
    }

    render(epoch) {
        if (!this.trajectory.isValidAtEpoch(epoch)) {
            this.point.visible = false;
            return;
        }

        this.point.visible = true;
        this.point.position.copy(sim.getVisualCoords(this.trajectory.getPositionByEpoch(epoch)));
        const scaleKoeff = this.pointSize * this.point.position.length() * this.pixelAngleSize;
        this.point.scale.x = scaleKoeff;
        this.point.scale.y = scaleKoeff;
        this.point.scale.z = scaleKoeff;
    }

    select() {
        this.setColor(this.config.selectedColor || 0xFFFFFF);
        for (let event of this.flightEvents) {
            event.model.setScale(1);
        }
        for (let k in this._markers) {
            this._markers[k].setScale(this._selectedMarkerScale);
        }
    }

    deselect() {
        this.setColor(this.config.color);
        for (let event of this.flightEvents) {
            event.model.setScale(0.5);
        }
        for (let k in this._markers) {
            this._markers[k].setScale(this._defaultMarkerScale);
        }
    }

    setColor(color) {
        this.color = color;
        if (this.point) {
            this.point.material.color.set(this.color);
            this.point.material.needsUpdate = true;
        }
        for (let event of this.flightEvents) {
            event.model.setColor(color);
        }
        for (let k in this._markers) {
            this._markers[k].setColor(color);
        }
    }

    drop() {
        this.threeObj && sim.selection.removeSelectableObject(this.threeObj);

        for (let k in this._markers) {
            this._markers[k].drop();
        }
        for (let event of this.flightEvents) {
            event.model.drop();
        }
        delete this.flightEvents;

        if (this.point) {
            this.scene.remove(this.point);
            if (this.point.geometry) {
                this.point.geometry.dispose();
            }
            if (this.point.material) {
                this.point.material.dispose();
            }
            delete this.point;
        }

        super.drop();
    }
}
