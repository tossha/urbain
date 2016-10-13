
class Vector3
{
    constructor(x, y, z) {
        this.vector = new Float64Array([
            x || 0,
            y || 0,
            z || 0
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

    abs() {
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
        let result = new Vector3();
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

class Matrix3
{
    constructor(a11, a12, a13, a21, a22, a23, a31, a32, a33) {
        this.matrix = new Float64Array([
            a11 || 1, a12 || 0, a13 || 0,
            a21 || 0, a22 || 1, a23 || 0,
            a31 || 0, a32 || 0, a33 || 1
        ]);
    }
}