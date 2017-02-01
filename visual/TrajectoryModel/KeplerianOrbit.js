class VisualTrajectoryModelKeplerianOrbit extends VisualTrajectoryModelAbstract
{
    getKeplerianObject(epoch) {
        return this.trajectory.keplerianObject;
    }

    render(epoch) {
        const endingBrightness = 0.35;

        const traj = this.getKeplerianObject(epoch);
        const centerPos = this.trajectory.referenceFrame.transformPositionByEpoch(epoch, ZERO_VECTOR, RF_BASE);
        const dr = -traj.sma * traj.e;
        const ta = traj.getTrueAnomalyByEpoch(epoch);
        const mainColor = new THREE.Color(this.color);
        let lastVertexIdx;
        let ang = Math.acos(
            (traj.e + Math.cos(ta)) / (1 + traj.e * Math.cos(ta))
        );

        if (ta > Math.PI) {
            ang = 2 * Math.PI - ang;
        }

        this.threeObj.geometry.dispose();
        this.threeObj.geometry = (new THREE.Path(
            (new THREE.EllipseCurve(
                dr * Math.cos(traj.aop),
                dr * Math.sin(traj.aop),
                traj.sma,
                traj.sma * Math.sqrt(1 - traj.e * traj.e),
                ang,
                2 * Math.PI + ang - 0.0000000000001,  // protection from rounding errors
                false,
                traj.aop
            )).getPoints(100)
        )).createPointsGeometry(100).rotateX(traj.inc);

        lastVertexIdx = this.threeObj.geometry.vertices.length - 1;

        for (let i = 0; i <= lastVertexIdx; i++) {
            let curColor = (new THREE.Color()).copy(mainColor);
            let mult = endingBrightness + (1 - endingBrightness) * i / lastVertexIdx;

            this.threeObj.geometry.colors.push(
                curColor.multiplyScalar(mult)
            );
        }

        this.threeObj.quaternion.copy(this.trajectory.referenceFrame.getQuaternionByEpoch(time.epoch).toThreejs());
        this.threeObj.rotation.z = traj.raan;
        this.threeObj.position.fromArray(centerPos.sub(camera.lastPosition));
    }
}