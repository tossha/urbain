class Body
{
    constructor(visualModel, physicalModel, trajectory, orientation) {
        this.visualModel   = visualModel;    // class VisualBodyModel
        this.physicalModel = physicalModel;  // class PhysicalBodyModel
        this.trajectory    = trajectory;     // class TrajectoryAbstract
        this.orientation   = orientation;

        this.visualModel.body = this;
    }
}

class VisualBodyModel
{
    constructor(shape, model, texture) {
        this.shape   = shape;   // class VisualShapeAbstract
        this.texture = texture;

        this.body = null; // class Body

        // ...
    }
}

class VisualShapeAbstract
{
    getThreeGeometry() {}
}

class VisualShapeSphere extends VisualShapeAbstract
{
    constructor(radius) {
        this.radius = radius;
    }

    getThreeGeometry() {
        // @todo implement
    }
}

class VisualShapeModel extends VisualShapeAbstract
{
    constructor(modelFile) {
        this.modelFile = modelFile;
    }

    getThreeGeometry() {
        // @todo implement
    }
}

class PhysicalBodyModel
{
    constructor(mu, radius) {
        this.mu     = mu;     // gravitational parameter
        this.radius = radius;
    }
}

class ReferenceFrame
{
    constructor(origin, type) {
        this.origin = origin || SOLAR_SYSTEM_BARYCENTER; // or maybe just EARTH?
        this.type = type || RF_TYPE_INERTIAL; // RF_TYPE_INERTIAL или RF_TYPE_ROTATING
    }

    getMatrixByEpoch(epoch) {
        // @todo implement
    }

    getTransformationMatrixByEpoch(epoch, destinationFrame) {
        if ((this.origin === destinationFrame.origin)
            && (this.type === destinationFrame.type)
        ) {
            return false; // @todo think about identity matrix here
        }

        // @todo implement
    }
}

class StateVector
{
    constructor(x, y, z, vx, vy, vz) {
        this.vector = new Float64Array([
            x || 0,
            y || 0,
            z || 0,
            vx || 0,
            vy || 0,
            vz || 0
        ]);
    }

    get position() {
        return new Vector3(this.vector[0], this.vector[1], this.vector[2]);
    }

    get velocity() {
        return new Vector3(this.vector[3], this.vector[4], this.vector[5]);
    }
}

class TrajectoryAbstract
{
    constructor(referenceFrame) {
        this.referenceFrame = referenceFrame || null; // class ReferenceFrame
    }

    getStateByEpoch(epoch, referenceFrame) {
        return ZERO_STATE_VECTOR;
    }

    getPositionByEpoch(epoch, referenceFrame) {
        return this.getStateByEpoch(epoch, referenceFrame).position;
    }

    getVelocityByEpoch(epoch, referenceFrame) {
        return this.getStateByEpoch(epoch, referenceFrame).velocity;
    }
}

class TrajectoryStateArray extends TrajectoryAbstract
{
    constructor() {
        this.states = []; // array of [epoch, class StateVector]
        this.minEpoch = null;
        this.maxEpoch = null;
    }

    addState(epoch, state) {
        this.state.push([epoch, state]);

        if ((this.minEpoch === null)
            || (epoch < this.minEpoch)
        ) {
            this.minEpoch = epoch;
        }

        if ((this.maxEpoch === null)
            || (epoch > this.maxEpoch)
        ) {
            this.maxEpoch = epoch;
        }
    }

    getStateByEpoch(epoch, referenceFrame) {
        // @todo implement
    }
}

const ZERO_STATE_VECTOR = new StateVector();
