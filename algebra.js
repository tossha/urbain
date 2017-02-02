const ZERO_VECTOR = new Vector(3);
const ZERO_STATE_VECTOR = new StateVector();
const IDENTITY_QUATERNION = new Quaternion();
const TWO_PI = 2 * Math.PI;

function deg2rad(degrees) {
    return degrees / 180 * Math.PI;
}

function rad2deg(radians) {
    return radians * 180 / Math.PI;
}

function approximateAngle(ang1, ang2, proportion) {
    ang1 = ((ang1 % TWO_PI) + TWO_PI) % TWO_PI;
    ang2 = ((ang2 % TWO_PI) + TWO_PI) % TWO_PI;

    let diff = ang2 - ang1;

    if (Math.abs(diff) > Math.PI) {
        diff = (diff > 0)
            ? (diff - TWO_PI)
            : (diff + TWO_PI);
    }

    return ((ang1 + diff * proportion) + TWO_PI) % TWO_PI;
}

function approximateNumber(n1, n2, proportion) {
    return n1 + (n2 - n1) * proportion;
}