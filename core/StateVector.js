class StateVector
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
}