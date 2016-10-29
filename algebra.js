
class Vector3
{
    constructor(x, y, z) {
        this.vector = new Float64Array([x, y, z]);
    }

    get x() {
        return this.vector[0];
    }

    get y() {
        return this.vector[1];
    }

    get z() {
        return this.vector[2];
    }

    set x(val) {
        this.vector[0] = val;
    }

    set y(val) {
        this.vector[1] = val;
    }

    set z(val) {
        this.vector[2] = val;
    }

    mag() {
        return Math.sqrt(this.vector[0] * this.vector[0] + this.vector[1] * this.vector[1] + this.vector[2] * this.vector[2]);
    }

    add(o) {
        return new Vector3(this.vector[0] + o.vector[0], this.vector[1] + o.vector[1], this.vector[2] + o.vector[2]);
    }

    sub(o) {
        return new Vector3(this.vector[0] - o.vector[0], this.vector[1] - o.vector[1], this.vector[2] - o.vector[2]);
    }

    mul(k) {
        return new Vector3(k * this.vector[0], k * this.vector[1], k * this.vector[2]);
    }

    div(k) {
        return new Vector3(this.vector[0] / k, this.vector[1] / k, this.vector[2] / k);
    }

    mulMatrix(mat) {
        let result = new Vector3(0, 0, 0);
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                result.vector[i] += mat.matrix[i * 3 + j] * this.vector[j];
            }
        }
        return result;
    }

    rotateX(radians) {
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        return this.mulMatrix(new Matrix3(
            1,   0,   0,
            0, cos, -sin,
            0, sin,  cos
        ));
    }

    rotateY(radians) {
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        return this.mulMatrix(new Matrix3(
             cos, 0, sin,
               0, 1,   0,
            -sin, 0, cos
        ));
    }

    rotateZ(radians) {
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        return this.mulMatrix(new Matrix3(
            cos, -sin, 0,
            sin,  cos, 0,
              0,    0, 1
        ));
    }
}

const ZERO_VECTOR = new Vector3(0, 0, 0);

class StateVector
{
    constructor(x, y, z, vx, vy, vz) {
        this.vector = new Float64Array([
            x,
            y,
            z,
            vx,
            vy,
            vz
        ]);
    }

    get x() {
        return this.vector[0];
    }

    get y() {
        return this.vector[1];
    }

    get z() {
        return this.vector[2];
    }

    get vx() {
        return this.vector[3];
    }

    get vy() {
        return this.vector[4];
    }

    get vz() {
        return this.vector[5];
    }

    get position() {
        return new Vector3(this.vector[0], this.vector[1], this.vector[2]);
    }

    get velocity() {
        return new Vector3(this.vector[3], this.vector[4], this.vector[5]);
    }

    mulMatrix(mat) {
        let result = new StateVector(0, 0, 0, 0, 0, 0);
        for (let i = 0; i < 6; ++i) {
            for (let j = 0; j < 6; ++j) {
                result.vector[i] += mat.matrix[i * 6 + j] * this.vector[j];
            }
        }
        return result;
    }

}

const ZERO_STATE_VECTOR = new StateVector(0, 0, 0, 0, 0, 0);

class Matrix3
{
    constructor(a11, a12, a13, a21, a22, a23, a31, a32, a33) {
        this.matrix = new Float64Array([
            a11, a12, a13,
            a21, a22, a23,
            a31, a32, a33
        ]);
    }
}

const IDENTITY_MATRIX3 = new Matrix3(
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
);

class Matrix6
{
    constructor(
        a11, a12, a13, a14, a15, a16,
        a21, a22, a23, a24, a25, a26,
        a31, a32, a33, a34, a35, a36,
        a41, a42, a43, a44, a45, a46,
        a51, a52, a53, a54, a55, a56,
        a61, a62, a63, a64, a65, a66
    ) {
        this.matrix = new Float64Array([
            a11, a12, a13, a14, a15, a16,
            a21, a22, a23, a24, a25, a26,
            a31, a32, a33, a34, a35, a36,
            a41, a42, a43, a44, a45, a46,
            a51, a52, a53, a54, a55, a56,
            a61, a62, a63, a64, a65, a66
        ]);
    }
}

const IDENTITY_MATRIX6 = new Matrix3(
    1, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0,
    0, 0, 0, 1, 0, 0,
    0, 0, 0, 0, 1, 0,
    0, 0, 0, 0, 0, 1
);

function deg2rad(degrees) {
    return degrees / 180 * Math.PI;
}

function red2deg(radians) {
    return radians * 180 / Math.PI;
}

function getQuaternionByEuler(x, y, z){
    return (new THREE.Quaternion()).setFromEuler(new THREE.Euler(x, y, z));
}

function multiplyOrientationByConstant(orientationQuat, constant){
    var orientationAngle = Math.acos(orientationQuat.w) * 2;
    var lastSin = Math.sin(orientationAngle / 2);

    orientationAngle = (orientationAngle * constant) % (Math.PI * 2);
    
    var newSin = Math.sin(orientationAngle / 2);
    var K = newSin / lastSin;

    orientationQuat.w = Math.cos(orientationAngle / 2);
    orientationQuat.x *= K; 
    orientationQuat.y *= K;
    orientationQuat.z *= K;

    orientationQuat.normalize();

    return orientationQuat;
}