import * as THREE from "three";

import VisualTrajectoryModelAbstract from "./Abstract";
import {RF_BASE_OBJ} from "../../ReferenceFrame/Factory";
import {acosSigned, isInInterval, TWO_PI, Vector} from "../../algebra";
import ReferenceFrameInertial from "../../ReferenceFrame/Inertial";
import { sim } from "../../simulation-engine";
import Constant from "../../FunctionOfEpoch/Constant";
import StateVector from "../../StateVector";
import VisualMarkerPericenter from "../Marker/Pericenter";
import VisualMarkerApocenter from "../Marker/Apocenter";

export default class VisualTrajectoryKeplerian extends VisualTrajectoryModelAbstract
{
    constructor(trajectory, config) {
        super(trajectory, config);
        this.showFull = !!config.showFull;
        this.trailPeriod = config.trailPeriod || false;
        this.lastPositionEpoch = false;
        this.lastFrameEpoch = false;
        this._markers.per = new VisualMarkerPericenter(this.threeObj, this.config.color);
        this._markers.apo = new VisualMarkerApocenter(this.threeObj, this.config.color);
        this._markers.per.setScale(0.5);
        this._markers.apo.setScale(0.5);
    }

    render(epoch) {
        super.render(epoch);

        const positionEpoch = this.getPositionEpoch(epoch);

        if (positionEpoch === false) {
            this.threeObj.visible = false;
            return;
        }

        this.lastPositionEpoch = positionEpoch;
        this.lastFrameEpoch = epoch;

        const keplerianObject = this.trajectory.getKeplerianObjectByEpoch(positionEpoch);

        if (keplerianObject.isElliptic) {
            this.renderEllipse(keplerianObject, positionEpoch, epoch);
        } else {
            this.renderHyperbola(keplerianObject, positionEpoch, epoch);
        }
    }

    getEpochByPoint(point) {
        const frame = this.trajectory.getReferenceFrameByEpoch(this.lastFrameEpoch);
        let framePos = frame.stateVectorFromBaseReferenceFrameByEpoch(this.lastFrameEpoch, new StateVector(point))._position;
        const keplerianObject = this.trajectory.getKeplerianObjectByEpoch(this.lastPositionEpoch);
        keplerianObject.getOrbitalFrameQuaternion().invert_().rotate_(framePos);
        return keplerianObject.getEpochByTrueAnomaly(Math.atan2(framePos.y, framePos.x));
    }

    /**
     *
     * @param traj {KeplerianObject} - orbit to be rendered
     * @param positionEpoch {float} - moment in time that specifies the position in orbit relative to its reference frame
     * @param frameEpoch {float} - moment in time that specifies the position of the reference frame
     */
    renderHyperbola(traj, positionEpoch, frameEpoch) {
        const endingBrightness = 0.35;
        const pointsNum = 100;

        let maxTa = traj.getAsymptoteTa() - 0.02;
        let minTa = -maxTa;

        if (this.trajectory.minEpoch !== false) {
            minTa = traj.getTrueAnomalyByEpoch(this.trajectory.minEpoch);
        }
        if (this.trajectory.maxEpoch !== false) {
            maxTa = traj.getTrueAnomalyByEpoch(this.trajectory.maxEpoch);
        }

        const orbitQuaternion = this.trajectory.pericentricReferenceFrame.getQuaternionByEpoch(positionEpoch);
        const curTa = traj.getTrueAnomalyByEpoch(positionEpoch);

        let points = [];
        let angs = [];
        let ta = minTa;
        let i = 0;

        if (ta > (minTa + curTa) / 2) {
            ta = (minTa + curTa) / 2;
        }

        const taStep = (Math.max(maxTa, curTa) - ta) / (pointsNum - 1);
        let extraPoints = 0;

        while (i < pointsNum + extraPoints) {
            let coords = traj.getOwnCoordsByTrueAnomaly(ta);
            points[i] = (new THREE.Vector2()).fromArray([coords[0], coords[1]]);
            angs[i] = (ta > curTa) ? 0 : ((curTa == minTa) ? 1 : (ta - minTa) / (curTa - minTa));
            i  += 1;
            ta += taStep;

            if (ta - taStep <= curTa && curTa < ta) {
                coords = traj.getOwnCoordsByTrueAnomaly(curTa);
                points[i] = (new THREE.Vector2()).fromArray([coords[0], coords[1]]);
                angs[i] = 1;
                i  += 1;
                points[i] = (new THREE.Vector2()).fromArray([coords[0], coords[1]]);
                angs[i] = 0;
                i  += 1;
                extraPoints += 2;
            }
        }

        this.updateGeometry(points, angs, endingBrightness);

        this.threeObj.quaternion.copy(orbitQuaternion.toThreejs());
        this.setPosition(this.trajectory.getReferenceFrameByEpoch(frameEpoch).getOriginPositionByEpoch(frameEpoch));

        this._markers.apo.disable();
        if (curTa > 0 && curTa < Math.PI) {
            this._markers.per.disable();
        } else {
            this._markers.per.enable();
            this._markers.per.setPosition(new THREE.Vector3(traj.getPeriapsisRadius(), 0, 0));
        }
    }

    /**
     *
     * @param traj {KeplerianObject} - orbit to be rendered
     * @param positionEpoch {float} - moment in time that specifies the position in orbit relative to its reference frame
     * @param frameEpoch {float} - moment in time that specifies the position of the reference frame
     */
    renderEllipse(traj, positionEpoch, frameEpoch) {
        const endingBrightness = 0.35;
        const pointsNum = 100;

        const orbitQuaternion = this.trajectory.pericentricReferenceFrame.getQuaternionByEpoch(positionEpoch);

        // Main working RF. We take reference frame of the object
        // at epoch and look at its position at locationEpoch
        const referenceFrame = new ReferenceFrameInertial(
            new Constant(this.trajectory.getReferenceFrameByEpoch(positionEpoch).getOriginStateByEpoch(frameEpoch)),
            orbitQuaternion
        );

        // Camera position relative to main reference frame
        const relativeCameraPosition = RF_BASE_OBJ.transformPositionByEpoch(frameEpoch, sim.camera.lastPosition, referenceFrame);

        // Camera position projected onto the plane of the orbit, relative to main reference frame
        const projectedRelativeCameraPosition = new Vector([relativeCameraPosition.x, relativeCameraPosition.y, 0]);

        // Camera position projected onto the plane of the orbit, in global coordinates
        const projectedCameraPosition = referenceFrame.transformPositionByEpoch(frameEpoch, projectedRelativeCameraPosition, RF_BASE_OBJ);

        // True anomaly of the camera
        const cameraTrueAnomaly = acosSigned(
            projectedRelativeCameraPosition.x / projectedRelativeCameraPosition.mag,
            projectedRelativeCameraPosition.y
        );

        const toClosestPoint = traj.getOwnCoordsByTrueAnomaly(cameraTrueAnomaly)                // not really closest
            .sub_(relativeCameraPosition).mag;
        const toFarthestPoint = traj.getOwnCoordsByTrueAnomaly(cameraTrueAnomaly + Math.PI)     // not really farthest
            .sub_(relativeCameraPosition).mag;

        let cameraAngle = traj.getEccentricAnomalyByTrueAnomaly(cameraTrueAnomaly);
        let ang = traj.getEccentricAnomalyByEpoch(positionEpoch);
        let minAnglePart = 0;
        let maxAnglePart = 1;

        if (!this.trailPeriod) {
            this._markers.per.enable();
            this._markers.per.setPosition(new THREE.Vector3(traj.getPeriapsisRadius() - projectedRelativeCameraPosition.x, -projectedRelativeCameraPosition.y, 0));
            this._markers.apo.enable();
            this._markers.apo.setPosition(new THREE.Vector3(-traj.getApoapsisRadius() - projectedRelativeCameraPosition.x, -projectedRelativeCameraPosition.y, 0));
        }

        // if there's less then one orbit left
        if (this.trailPeriod) {
            let minEpoch = positionEpoch - this.trailPeriod;
            if (this.trajectory.minEpoch !== false && this.trajectory.minEpoch > minEpoch) {
                minEpoch = this.trajectory.minEpoch;
            }
            this._markers.per.disable();
            this._markers.apo.disable();
            minAnglePart = 1 - (((ang - traj.getEccentricAnomalyByEpoch(minEpoch)) + TWO_PI) % TWO_PI) / TWO_PI;
            maxAnglePart = 1;
        } else if (!this.showFull
            && this.trajectory.maxEpoch !== false
            && (this.trajectory.maxEpoch - positionEpoch) < traj.period
        ) {
            // rendering a part of ellipse
            const maxAng = traj.getEccentricAnomalyByEpoch(this.trajectory.maxEpoch);
            maxAnglePart = (((maxAng - ang) + TWO_PI) % TWO_PI) / TWO_PI;

            const maxMa = traj.getMeanAnomalyByEpoch(this.trajectory.maxEpoch);
            const curMa = traj.getMeanAnomalyByEpoch(positionEpoch);
            if (!isInInterval(0, [curMa, maxMa])) {
                this._markers.per.disable();
            }
            if (!isInInterval(Math.PI, [curMa, maxMa])) {
                this._markers.apo.disable();
            }
        }

        const ellipsePoints = this.getEllipsePoints(
            new THREE.EllipseCurve(
                -traj.sma * traj.ecc - projectedRelativeCameraPosition.x,
                -projectedRelativeCameraPosition.y,
                traj.sma,
                traj.sma * Math.sqrt(1 - traj.ecc * traj.ecc),
                ang,
                TWO_PI + ang - 1e-13,  // protection from rounding errors
                false,
                0
            ),
            pointsNum,
            ((cameraAngle - ang) / TWO_PI + 1) % 1,
            toFarthestPoint / toClosestPoint,
            minAnglePart,
            maxAnglePart
        );

        this.updateGeometry(ellipsePoints.coords, ellipsePoints.angs, endingBrightness);

        this.threeObj.quaternion.copy(orbitQuaternion.toThreejs());
        this.setPosition(projectedCameraPosition);
    }

    /**
     *
     * @param curve {EllipseCurve} - instance of THREE.EllipseCurve
     * @param pointsNum {int} - number of points to get (or less, if maxAnglePart is less than 1)
     * @param densityCenter {number} - part of the angle (from 0 to 1) closest to the camera,
     *                                which means this area should have more points
     * @param proportion {number} - point density difference between densityCenter and
     *                              the opposite side of the ellipse
     * @param minAnglePart {number} - must be between 0 and 1, where 1 means two pi.
     * @param maxAnglePart {number} - must be between 0 and 1, where 1 means two pi.
     * @returns {{coords: Array, angs: Array}}
     */
    getEllipsePoints(curve, pointsNum, densityCenter, proportion, minAnglePart, maxAnglePart) {
        let nearSegmentSize = 0.25;
        if (proportion > 30) {
            nearSegmentSize = 1 / Math.min(proportion / 60 + 3.5, 12);
            proportion = 30;
        }

        let coords = [];
        let angs = [];
        const segments = pointsNum - 3;
        const otherSegmentsSize = (1 - nearSegmentSize) / 3;
        const segmentsFar    = Math.floor(segments / (proportion + 2 * Math.sqrt(proportion) + 1));
        const segmentsMedium = Math.floor(Math.sqrt(proportion) * segmentsFar);
        const segmentsNear   = segments - segmentsFar - 2 * segmentsMedium;
        let segmentBounds = [0,0,0,0,0];
        let segmentSteps = [
            nearSegmentSize/segmentsNear,
            otherSegmentsSize/segmentsMedium,
            otherSegmentsSize/segmentsFar,
            otherSegmentsSize/segmentsMedium
        ];
        let curPos = minAnglePart;

        segmentBounds[0] = densityCenter - nearSegmentSize / 2;
        if (segmentBounds[0] < 0)
            segmentBounds[0] += 1;
        segmentBounds[1] = segmentBounds[0] + nearSegmentSize;
        if (segmentBounds[1] > 1)
            segmentBounds[1] -= 1;
        for (let i = 2; i <= 4; ++i) {
            segmentBounds[i] = segmentBounds[i - 1] + otherSegmentsSize;
            if (segmentBounds[i] > 1)
                segmentBounds[i] -= 1;
        }

        while (curPos < maxAnglePart) {
            if (curPos >= minAnglePart) {
                coords.push(curve.getPoint(curPos));
                angs.push((curPos - minAnglePart) / (maxAnglePart - minAnglePart));
            }
            let i = 0;
            while (i < 4) {
                if ((segmentBounds[i+1] > segmentBounds[i]
                    && (segmentBounds[i] <= curPos && curPos < segmentBounds[i+1]))
                    || (segmentBounds[i+1] < segmentBounds[i]
                        && (segmentBounds[i] <= curPos || curPos < segmentBounds[i+1]))
                ) {
                    break;
                }
                ++i;
            }
            curPos += segmentSteps[i];
        }
        coords.push(curve.getPoint(maxAnglePart));
        angs.push(maxAnglePart);

        return {
            coords: coords,
            angs: angs
        }
    }
}
