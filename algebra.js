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

function getAngleBySinCos(sin, cos) {
    const ang = Math.acos(cos);
    return (sin > 0)
        ? ang
        : (2 * Math.PI - ang);
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

function presentNumberWithPrefix(number) {
    if (Math.abs(number) >= 1000000000) {
        return (number / 1000000000).toFixed(3) + ' G';
    }
    if (Math.abs(number) >= 1000000) {
        return (number / 1000000).toFixed(3) + ' M';
    }
    if (Math.abs(number) >= 1000) {
        return (number / 1000).toFixed(3) + ' K';
    }
    if (Math.abs(number) <= 0.000000001) {
        return (number / 0.000000001).toFixed(3) + ' n';
    }
    if (Math.abs(number) <= 0.000001) {
        return (number / 0.000001).toFixed(3) + ' µ';
    }
    if (Math.abs(number) <= 0.001) {
        return (number / 0.001).toFixed(3) + ' m';
    }
    return number.toPrecision(6) + ' ';
}
