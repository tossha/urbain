class VisualTrajectoryModelKeplerian extends VisualTrajectoryModelAbstract
{
    render(epoch) {
        const endingBrightness = 0.35;
        const pointsNum = 100;

        const traj = this.trajectory.getKeplerianObjectByEpoch(epoch);
        const orbitQuaternion = this.trajectory.orbitalReferenceFrame.getQuaternionByEpoch(epoch);
        const cameraPosition = sim.starSystem.getReferenceFrame(RF_BASE).transformPositionByEpoch(epoch, sim.camera.lastPosition, this.trajectory.orbitalReferenceFrame);
        const visualOrigin = new Vector([cameraPosition.x, cameraPosition.y, 0]);
        const actualVisualOrigin = this.trajectory.orbitalReferenceFrame.transformPositionByEpoch(epoch, visualOrigin, RF_BASE);
        const ta = traj.getTrueAnomalyByEpoch(epoch);
        const mainColor = new THREE.Color(this.color);
        const sinE = visualOrigin.y / visualOrigin.mag;
        const cosE = visualOrigin.x / visualOrigin.mag;
        const cameraTrueAnomaly = getAngleBySinCos(sinE, cosE);
        const toClosestPoint = traj.getEllipseCoordsByTrueAnomaly(cameraTrueAnomaly)                // not really closest
            .sub(cameraPosition).mag;
        const toFarthestPoint = traj.getEllipseCoordsByTrueAnomaly(cameraTrueAnomaly + Math.PI)     // not really farthest
            .sub(cameraPosition).mag;
        const cameraAngle = traj.getEccentricAnomalyByTrueAnomaly(cameraTrueAnomaly - ta);
        let ang = Math.acos(
            (traj.e + Math.cos(ta)) / (1 + traj.e * Math.cos(ta))
        );

        if (ta > Math.PI) {
            ang = 2 * Math.PI - ang;
        }

        const ellipsePoints = this.getEllipsePoints(
            new THREE.EllipseCurve(
                -traj.sma * traj.e - visualOrigin.x,
                -visualOrigin.y,
                traj.sma,
                traj.sma * Math.sqrt(1 - traj.e * traj.e),
                ang,
                2 * Math.PI + ang - 0.0000000000001,  // protection from rounding errors
                false,
                0
            ),
            pointsNum,
            cameraAngle / (2 * Math.PI),
            toFarthestPoint / toClosestPoint
        );

        this.threeObj.geometry.dispose();
        this.threeObj.geometry = (new THREE.Path(
            ellipsePoints.coords
        )).createPointsGeometry(pointsNum);

        for (let i = 0; i < ellipsePoints.angs.length; i++) {
            let curColor = (new THREE.Color()).copy(mainColor);
            let mult = endingBrightness + (1 - endingBrightness) * ellipsePoints.angs[i];

            this.threeObj.geometry.colors.push(
                curColor.multiplyScalar(mult)
            );
        }

        this.threeObj.quaternion.copy(orbitQuaternion.toThreejs());
        this.threeObj.position.fromArray(sim.getVisualCoords(actualVisualOrigin));
    }

    getEllipsePoints(curve, pointsNum, densityCenter, proportion) {
        let nearSegmentSize = 0.25;
        if (proportion > 30) {
            nearSegmentSize = 1 / ((Math.min(proportion, 530) - 30) / 60 + 4);
            proportion = 30;
        }

        let coords = [];
        let angs = [];
        const segments = pointsNum - 3;
        const otherSegmentsSize = (1 - nearSegmentSize) / 3;
        const segmentsFar    = Math.floor(segments / (proportion + 2 * Math.sqrt(proportion) + 1));
        const segmentsMedium = Math.floor(Math.sqrt(proportion) * segmentsFar);
        const segmentsNear   = segments - segmentsFar - 2 * segmentsMedium;
        let curPos = densityCenter - nearSegmentSize / 2;

        if (curPos < 0) {
            curPos += 1;
        }
        coords.push(curve.getPoint(curPos));
        angs.push(curPos);

        for (const partSize of [[segmentsNear, nearSegmentSize], [segmentsMedium, otherSegmentsSize], [segmentsFar, otherSegmentsSize], [segmentsMedium, otherSegmentsSize]]) {
            for (let i = 0; i < partSize[0]; ++i) {
                curPos += partSize[1] / partSize[0];
                if (curPos > 1) {
                    coords.push(curve.getPoint(1));
                    angs.push(1);
                    coords.push(curve.getPoint(0));
                    angs.push(0);
                    curPos -= 1;
                }
                coords.push(curve.getPoint(curPos));
                angs.push(curPos);
            }
        }

        return {
            coords: coords,
            angs: angs
        }
    }
}