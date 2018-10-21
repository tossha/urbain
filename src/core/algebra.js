import * as THREE from "three";

export class Vector extends Array
{
    constructor(dimOrArray) {
        super();
        if (dimOrArray === undefined) {
            dimOrArray = 3;
        }
        if (dimOrArray instanceof Array) {
            for (let i = 0; i < dimOrArray.length; ++i) {
                this[i] = dimOrArray[i];
            }
        } else {
            for (let i = 0; i < dimOrArray; ++i) {
                this[i] = 0;
            }
        }

        Object.setPrototypeOf(this, Vector.prototype);
    }

    get x() {
        return this[0];
    }

    set x(value) {
        this[0] = value;
    }

    get y() {
        return this[1];
    }

    set y(value) {
        this[1] = value;
    }

    get z() {
        return this[2];
    }

    set z(value) {
        this[2] = value;
    }

    get quadrance() {
        let res = 0;
        for (let i = 0; i < this.length; ++i) {
            res += this[i] * this[i];
        }
        return res;
    }

    get mag() {
        return Math.sqrt(this.quadrance);
    }

    copy() {
        return new Vector(this);
    }

    set(arrayOrVarargs) {
        let vals = (arguments.length === 1) ? arguments[0] : arguments;
        if (vals.length == null) {
            vals = [vals];
        }
        for (let i = 0; i < this.length; ++i) {
            this[i] = vals[i];
        }
        return this;
    }

    dot(vec) {
        let res = 0;
        for (let i = 0; i < this.length; ++i) {
            res += this[i] * vec[i];
        }
        return res;
    }

    cross(vec) {
        return new Vector([
            this[1] * vec[2] - this[2] * vec[1],
            this[2] * vec[0] - this[0] * vec[2],
            this[0] * vec[1] - this[1] * vec[0],
        ]);
    }

    angle(vec) {
        const cos = this.dot(vec) / this.mag / vec.mag;
        if (cos <= -1) {
            return Math.PI;
        }
        if (cos >= 1) {
            return 0;
        }
        return Math.acos(cos);
    }

    add_(vec) {
        for (let i = 0; i < this.length; ++i) {
            this[i] += vec[i];
        }
        return this;
    }

    sub_(vec) {
        for (let i = 0; i < this.length; ++i) {
            this[i] -= vec[i];
        }
        return this;
    }

    mul_(scalar) {
        for (let i = 0; i < this.length; ++i) {
            this[i] *= scalar;
        }
        return this;
    }

    div_(scalar) {
        for (let i = 0; i < this.length; ++i) {
            this[i] /= scalar;
        }
        return this;
    }

    rotate_(axis, angle) {
        return (new Quaternion(axis, angle)).rotate_(this);
    }

    unit_() {
        return this.div_(this.mag);
    }

    projectOn_(v) {
        let unit = v.unit();
        this.set(unit.mul_(this.dot(unit)));
        return this;
    }

    add(vec) {
        return this.copy().add_(vec);
    }

    sub(vec) {
        return this.copy().sub_(vec);
    }

    mul(scalar) {
        return this.copy().mul_(scalar);
    }

    div(scalar) {
        return this.copy().div_(scalar);
    }

    unit() {
        return this.copy().unit_();
    }

    projectOn(v) {
        return this.copy().projectOn_(v);
    }

    projectionOn(v) {
        return this.dot(v.unit());
    }

    rotate(axis, angle) {
        return this.copy().rotate_(axis, angle);
    }

    rotateX(radians) {
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        return new Vector([
            this[0],
            this[1] * cos - this[2] * sin,
            this[1] * sin + this[2] * cos,
        ]);
    }

    rotateY(radians) {
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        return new Vector([
            this[0] * cos + this[2] * sin,
            this[1],
            -this[0] * sin + this[2] * cos,
        ]);
    }

    rotateZ(radians) {
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        return new Vector([
            this[0] * cos - this[1] * sin,
            this[0] * sin + this[1] * cos,
            this[2],
        ]);
    }
}

export class Quaternion
{
    constructor(vector, angle) {
        this.t = 1;
        this.v = new Vector(3);

        if (vector instanceof Array) {
            this.setAxisAngle(vector || [1, 0, 0], angle || 0);
        }
    }

    static copy(q) {
        return q.copy();
    }

    static mul(q1, q2) {
        return q1.copy().mul_(q2);
    }

    static transfer(fromVector, toVector) {
        const angle = fromVector.angle(toVector);
        if (angle) {
            return new Quaternion(fromVector.cross(toVector), angle);
        } else {
            return new Quaternion();
        }
    }

    static twoAxis(x, y ,z) {
        let normal1;
        let normal2;
        let quat;
        if (x && y) {
            normal1 = new Vector([0, 0, 1]);
            normal2 = x.cross(y);
        } else if (x && z) {
            normal1 = new Vector([0, 1, 0]);
            normal2 = z.cross(x);
        } else if (y && z) {
            normal1 = new Vector([1, 0, 0]);
            normal2 = y.cross(z);
        }
        quat = Quaternion.transfer(normal1, normal2);
        return x
            ? Quaternion.transfer(quat.rotate_(new Vector([1,0,0])), x).mul_(quat)
            : Quaternion.transfer(quat.rotate_(new Vector([0,1,0])), y).mul_(quat);
    }

    static slerp(q1, q2, t) {
        if (t == 0) {
            return q1.copy();
        } else if (t == 1) {
            return q2.copy();
        }

        let res = q2.copy();
        let cosHalfTheta = q1.t * q2.t + q1.v[0] * q2.v[0] + q1.v[1] * q2.v[1] + q1.v[2] * q2.v[2];

        if (cosHalfTheta < 0) {
            res.t = -q2.t;
            res.v[0] = -q2.v[0];
            res.v[1] = -q2.v[1];
            res.v[2] = -q2.v[2];
            cosHalfTheta = -cosHalfTheta;
        }

        if (cosHalfTheta >= 1) {
            return q1.copy();
        }

        let sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);

        if (sinHalfTheta < 0.001) {
            res.t = (q1.t + res.t) / 2;
            res.v[0] = (q1.v[0] + res.v[0]) / 2;
            res.v[1] = (q1.v[1] + res.v[1]) / 2;
            res.v[2] = (q1.v[2] + res.v[2]) / 2;
            return res;
        }

        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratio1 = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        const ratio2 = Math.sin(t * halfTheta) / sinHalfTheta;

        res.t = q1.t * ratio1 + res.t * ratio2;
        res.v[0] = q1.v[0] * ratio1 + res.v[0] * ratio2;
        res.v[1] = q1.v[1] * ratio1 + res.v[1] * ratio2;
        res.v[2] = q1.v[2] * ratio1 + res.v[2] * ratio2;
        return res;
    }

    static invert(quat) {
        return quat.invert();
    }

    copy() {
        let res = new Quaternion();
        res.t = this.t;
        res.v = this.v.copy();
        return res;
    }

    quadrance() {
        return this.t * this.t + this.v[0] * this.v[0] + this.v[1] * this.v[1] + this.v[2] * this.v[2];
    }

    length() {
        return Math.sqrt(this.quadrance());
    }

    invert_() {
        let quadrance = this.quadrance();
        this.t /= quadrance;
        this.v.div_(-quadrance);
        return this;
    }

    invert() {
        return this.copy().invert_();
    }

    normalize_() {
        let len = this.length();
        this.t /= len;
        this.v.div_(len);
        return this;
    }

    normalize() {
        return this.copy().normalize_();
    }

    rotate_(vector) {
        let cx = this.v.cross(vector).mul_(2);
        let cx2 = this.v.cross(cx);
        vector[0] += this.t * cx[0] + cx2[0];
        vector[1] += this.t * cx[1] + cx2[1];
        vector[2] += this.t * cx[2] + cx2[2];
        return vector;
    }

    rotate(vector) {
        return this.rotate_(vector.copy());
    }

    mul_(quat) {
        const w = this.t;
        const x = this.v[0];
        const y = this.v[1];
        const z = this.v[2];
        const ow = quat.t;
        const ox = quat.v[0];
        const oy = quat.v[1];
        const oz = quat.v[2];

        this.t = w * ow - x * ox - y * oy - z * oz;
        this.v[0] = w * ox + x * ow + y * oz - z * oy;
        this.v[1] = w * oy - x * oz + y * ow + z * ox;
        this.v[2] = w * oz + x * oy - y * ox + z * ow;

        return this;
    }

    mul(quat) {
        return this.copy().mul_(quat);
    }

    setAxisAngle(axis, angle) {
        this.t = Math.cos(angle / 2);
        this.v.set(axis);
        this.v.mul_(Math.sin(angle / 2) / this.v.mag);
        return this;
    }

    setFromEuler(x, y, z, order) {
        const c1 = Math.cos(x / 2);
        const c2 = Math.cos(y / 2);
        const c3 = Math.cos(z / 2);
        const s1 = Math.sin(x / 2);
        const s2 = Math.sin(y / 2);
        const s3 = Math.sin(z / 2);

        order = order || 'ZYX';

        if (order === 'XYZ') {
            this.v.set([
                s1 * c2 * c3 + c1 * s2 * s3,
                c1 * s2 * c3 - s1 * c2 * s3,
                c1 * c2 * s3 + s1 * s2 * c3
            ]);
            this.t = c1 * c2 * c3 - s1 * s2 * s3;
        } else if (order === 'YXZ') {
            this.v.set([
                s1 * c2 * c3 + c1 * s2 * s3,
                c1 * s2 * c3 - s1 * c2 * s3,
                c1 * c2 * s3 - s1 * s2 * c3
            ]);
            this.t = c1 * c2 * c3 + s1 * s2 * s3;
        } else if (order === 'ZXY') {
            this.v.set([
                s1 * c2 * c3 - c1 * s2 * s3,
                c1 * s2 * c3 + s1 * c2 * s3,
                c1 * c2 * s3 + s1 * s2 * c3
            ]);
            this.t = c1 * c2 * c3 - s1 * s2 * s3;
        } else if (order === 'ZYX') {
            this.v.set([
                s1 * c2 * c3 - c1 * s2 * s3,
                c1 * s2 * c3 + s1 * c2 * s3,
                c1 * c2 * s3 - s1 * s2 * c3
            ]);
            this.t = c1 * c2 * c3 + s1 * s2 * s3;
        } else if (order === 'YZX') {
            this.v.set([
                s1 * c2 * c3 + c1 * s2 * s3,
                c1 * s2 * c3 + s1 * c2 * s3,
                c1 * c2 * s3 - s1 * s2 * c3
            ]);
            this.t = c1 * c2 * c3 - s1 * s2 * s3;
        } else if (order === 'XZY') {
            this.v.set([
                s1 * c2 * c3 - c1 * s2 * s3,
                c1 * s2 * c3 - s1 * c2 * s3,
                c1 * c2 * s3 + s1 * s2 * c3
            ]);
            this.t = c1 * c2 * c3 + s1 * s2 * s3;
        } else if (order === 'ZXZ') {
            this.v.set([
                Math.cos((x - z) / 2) * s2,
                Math.sin((x - z) / 2) * s2,
                Math.sin((x + z) / 2) * c2
            ]);
            this.t = Math.cos((x + z) / 2) * c2
        }
        return this;
    }

    toThreejs() {
        return new THREE.Quaternion(this.v[0], this.v[1], this.v[2], this.t);
    }
}

export const TWO_PI = 2 * Math.PI;

export function newtonSolve(func, start, d, maxError, maxSteps) {
    let step = 0;
    let val = start;
    let error;

    do {
        const v1 = func(val);
        const v2 = func(val + d);
        const diff = (v2 - v1) / d;

        if (v1 === null || v2 === null) {
            return null;
        }

        error = Math.abs(v1);
        val -= v1 / diff;
        step += 1;
    } while (error > maxError && step < maxSteps);

    return (error > maxError) ? null : val;
}

export function deg2rad(degrees) {
    return degrees / 180 * Math.PI;
}

export function rad2deg(radians) {
    return radians * 180 / Math.PI;
}

export function acosSigned(cos, sinSign) {
    const ang = Math.acos(cos);
    return (sinSign > 0)
        ? ang
        : (TWO_PI - ang);
}

export function angleIntervalIntersection(int1, int2) {
    if (!int1 || !int2) {
        return false;
    } else if (int1[0] <= int2[0] && int2[1] <= int1[1]) {
        return int2;
    } else if (int2[0] <= int1[0] && int1[1] <= int2[1]) {
        return int1;
    } else if (int1[0] <= int2[0] && int2[0] <= int1[1]) {
        return [int2[0], int1[1]];
    } else if (int1[0] <= int2[1] && int2[1] <= int1[1]) {
        return [int1[0], int2[1]];
    }
    return false;
}

export function getAngleIntervalsIntersection(intervals1, intervals2) {
    let result = [];
    if (intervals1 === false || intervals2 === false) {
        return false;
    }
    if (intervals1 === true) {
        return intervals2;
    }
    if (intervals2 === true) {
        return intervals1;
    }
    for (let interval1 of intervals1) {
        const int11 = [interval1[0], interval1[1] > interval1[0] ? interval1[1] : TWO_PI];
        const int12 = interval1[1] > interval1[0] ? false : [0, interval1[1]];
        for (let interval2 of intervals2) {
            const int21 = [interval2[0], interval2[1] > interval2[0] ? interval2[1] : TWO_PI];
            const int22 = interval2[1] > interval2[0] ? false : [0, interval2[1]];
            let r;
            if (r = angleIntervalIntersection(int11, int21))
                result.push(r);
            if (r = angleIntervalIntersection(int11, int22))
                result.push(r);
            if (r = angleIntervalIntersection(int12, int21))
                result.push(r);
            if (r = angleIntervalIntersection(int12, int22))
                result.push(r);
        }
    }
    return result.length ? result : false;
}

export function isInInterval(angle, interval) {
    angle = (angle + TWO_PI) % TWO_PI;
    if (interval[0] <= interval[1]) {
        return (interval[0] <= angle) && (angle <= interval[1]);
    } else {
        return (interval[0] <= angle) || (angle <= interval[1]);
    }
}

export function getEpochIntervalsIntersection(intervals1, intervals2) {
    let result = [];
    if (intervals1 === false || intervals2 === false) {
        return false;
    }
    if (intervals1 === true) {
        return intervals2;
    }
    if (intervals2 === true) {
        return intervals1;
    }
    for (let interval1 of intervals1) {
        const epoch1 = interval1[0];
        const epoch2 = interval1[1];
        for (let interval2 of intervals2) {
            const epoch21 = interval2[0];
            const epoch22 = interval2[1];
            if (epoch1 <= epoch21 && epoch21 < epoch2) {
                result.push([
                    epoch21,
                    epoch2 < epoch22 ? epoch2 : epoch22
                ]);
            } else if (epoch1 < epoch22 && epoch22 <= epoch2) {
                result.push([
                    epoch1,
                    epoch22,
                ]);
            } else if (epoch1 < epoch21 && epoch22 < epoch2) {
                result.push([
                    epoch21,
                    epoch22,
                ]);
            } else if (epoch21 < epoch1 && epoch2 < epoch22) {
                result.push([
                    epoch1,
                    epoch2,
                ]);
            }
        }
    }
    return result.length ? result : false;
}

export function approximateAngle(ang1, ang2, proportion) {
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

export function approximateNumber(n1, n2, proportion) {
    return n1 + (n2 - n1) * proportion;
}

export function presentNumberWithSuffix(number) {
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
