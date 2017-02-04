class THREEHelperPlane extends THREE.Plane {
    raycast(raycaster, intersects) {
        debugger;
    }
}

class HelperPlane
{
    constructor(centerObject) {
        let pos = TRAJECTORIES[centerObject].getPositionByEpoch(time.epoch, RF_BASE);

        this.centerObject = centerObject;
        this.threeGrid = new THREE.PolarGridHelper(BODIES[centerObject].physicalModel.radius * 1e+2 , 32, 32, 200);
        this.threeGrid.position.fromArray(pos.sub(camera.lastPosition));
        this.threeGrid.quaternion.copy(BODIES[centerObject].orientation.getQuaternionByEpoch(time.epoch).toThreejs());
        this.threeGrid.rotateX(Math.PI / 2);

        scene.add(this.threeGrid);
    }

    update(epoch) {
        let pos = TRAJECTORIES[this.centerObject].getPositionByEpoch(epoch, RF_BASE);
        this.threeGrid.position.fromArray(pos.sub(camera.lastPosition));
    }

    onZoom(newDistance) {
        
    }
}

function getPlanePosition(pos, quat) {
    let normal = (new THREE.Vector3(0, 0, 1)).applyQuaternion(quat);
    let mrVector = (new THREE.Vector3).crossVectors(normal, pos);
    let mrCathetus = (new THREE.Vector3).crossVectors(normal, mrVector);
    let cos = pos.dot(mrCathetus) / (pos.length() * mrCathetus.length());
    let angle = (cos >= 0) ? Math.acos(cos) : Math.PI - Math.acos(cos);
    let distance = pos.length() * Math.sin(angle);
    return {
        normal: normal,
        distance: - distance
    }
};