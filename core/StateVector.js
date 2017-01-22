class StateVector
{
    constructor(position, velocity) {
        this._position = position ? Vector.copy(position) : new Vector(3);
        this._velocity = velocity ? Vector.copy(velocity) : new Vector(3);
    }

    get position() {
        return Vector.copy(this._position);
    }

    get velocity() {
        return Vector.copy(this._velocity);
    }

    static create(x, y, z, vx, vy, vz) {
        return new this(
            new Vector([ x || 0,  y || 0,  z || 0]),
            new Vector([vx || 0, vy || 0, vz || 0])
        );
    }
}