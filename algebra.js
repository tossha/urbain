const ZERO_VECTOR = new Vector(3);
const ZERO_STATE_VECTOR = new StateVector();
const IDENTITY_QUATERNION = new Quaternion();

function deg2rad(degrees) {
    return degrees / 180 * Math.PI;
}

function rad2deg(radians) {
    return radians * 180 / Math.PI;
}
