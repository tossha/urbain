import {Vector} from "./algebra";

export default class StateVector
{
    constructor(position, velocity) {
        this._position = position ? position.copy() : new Vector();
        this._velocity = velocity ? velocity.copy() : new Vector();
    }

    get position() {
        return this._position.copy();
    }

    get velocity() {
        return this._velocity.copy();
    }

    static create(x, y, z, vx, vy, vz) {
        return new this(
            new Vector([ x || 0,  y || 0,  z || 0]),
            new Vector([vx || 0, vy || 0, vz || 0])
        );
    }

    copy() {
        return new StateVector(this._position, this._velocity);
    }

    rotate_(quaternion) {
        quaternion.rotate_(this._position);
        quaternion.rotate_(this._velocity);
        return this;
    }

    rotate(quaternion) {
        return this.copy().rotate_(quaternion);
    }
}
