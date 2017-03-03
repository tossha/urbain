/*class THREEHelperPlane extends THREE.Plane 
{
    raycast(raycaster, intersects) {
        debugger;
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

let myVector = new THREE.Vector3(0, 0, 1);
let myQuat = (new THREE.Quaternion).setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4);
let planePos = getPlanePosition(myVector, myQuat);
var plane = new THREEHelperPlane(planePos.normal, planePos.distance);
*/