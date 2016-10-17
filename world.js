
class ReferenceFrame
{
    constructor(origin, type) {
        this.origin = origin;
        this.type = type || RF_TYPE_INERTIAL; // RF_TYPE_INERTIAL или RF_TYPE_ROTATING
    }

    getMatrixByEpoch(epoch) {
        // @todo implement
    }

    transformStateVectorByEpoch(epoch, state, destinationFrame) {
        if ((this.type !== RF_TYPE_INERTIAL)
            || (destinationFrame.type !== RF_TYPE_INERTIAL)
        ) {
            // @tofo implement
            console.log('Rotating frames are not supported yet');
            return;
        }

        if ((this.origin === destinationFrame.origin)
            && (this.type === destinationFrame.type)
        ) {
            return state;
        }

        let pos1 = TRAJECTORIES[this.origin].getPositionByEpoch(epoch, RF_BASE);
        let pos2 = TRAJECTORIES[destinationFrame.origin].getPositionByEpoch(epoch, RF_BASE);
        let diff = pos1.sub(pos2);
        return new StateVector(
            state.x + diff.x,
            state.y + diff.y,
            state.z + diff.z,
            state.vx,
            state.vy,
            state.vz
        );
    }

    transformPositionByEpoch(epoch, pos, destinationFrame) {
        return this.transformStateVectorByEpoch(
            epoch,
            new StateVector(pos.x, pos.y, pos.z, 0, 0, 0),
            destinationFrame
        ).position;
    }

    getTransformationMatrixByEpoch(epoch, destinationFrame) {
        if ((this.origin === destinationFrame.origin)
            && (this.type === destinationFrame.type)
        ) {
            return IDENTITY_MATRIX6; // @todo think about optimization here
        }

        // @todo implement
    }
}

class TrajectoryAbstract
{
    constructor(referenceFrame) {
        this.referenceFrame = referenceFrame || null; // class ReferenceFrame
    }

    getStateInOwnFrameByEpoch(epoch) {
        return ZERO_STATE_VECTOR;
    }

    getStateByEpoch(epoch, referenceFrame) {
        let state = this.getStateInOwnFrameByEpoch(epoch);
        return this.referenceFrame.transformStateVectorByEpoch(epoch, state, referenceFrame);
    }

    getPositionByEpoch(epoch, referenceFrame) {
        return this.getStateByEpoch(epoch, referenceFrame).position;
    }

    getVelocityByEpoch(epoch, referenceFrame) {
        return this.getStateByEpoch(epoch, referenceFrame).velocity;
    }

    render(epoch) {}
}

class TrajectoryStaticPosition extends TrajectoryAbstract
{
    constructor(referenceFrame, pos) {
        super(referenceFrame);

        this.pos = pos;
    }

    getStateInOwnFrameByEpoch(epoch) {
        return new StateVector(this.pos.x, this.pos.y, this.pos.z, 0, 0, 0);
    }
}

class TrajectoryKeplerianOrbit extends TrajectoryAbstract
{
    constructor(referenceFrame, mu, sma, e, inc, raan, aop, m0, epoch, color) {
        super(referenceFrame);

        this.mu     = mu;
        this.sma    = sma;
        this.e      = e;
        this.inc    = inc;
        this.raan   = raan;
        this.aop    = aop;
        this.m0     = m0;
        this.epoch  = epoch;
        this.color  = color;

        this.meanMotion = Math.sqrt(mu / sma) / sma;

        // @todo remove this from here
        this.threeObj = new THREE.Line(
            new THREE.Geometry(),
            new THREE.LineBasicMaterial({color: this.color, vertexColors: THREE.VertexColors})
        );

        scene.add(this.threeObj);
    }

    getMeanAnomaly(epoch) {
        return this.m0 + this.meanMotion * (epoch - this.epoch);
    }

    getEccentricAnomaly(epoch) {
        let M = this.getMeanAnomaly(epoch) / (2.0 * Math.PI);
        let maxIter = 30, i = 0;
        let delta = 0.00000001;
        let E, F;

        M = 2.0 * Math.PI * (M - Math.floor(M));

        E = (this.e < 0.8) ? M : Math.PI;

        F = E - this.e * Math.sin(M) - M;

        while ((Math.abs(F) > delta) && (i < maxIter)) {
            E = E - F / (1.0 - this.e * Math.cos(E));
            F = E - this.e * Math.sin(E) - M;
            i = i + 1;
        }

        return E;
    }

    getTrueAnomaly(epoch) {
        let E = this.getEccentricAnomaly(epoch);
        let phi = Math.atan2(Math.sqrt(1.0 - this.e * this.e) * Math.sin(E), Math.cos(E) - this.e);
        return (phi > 0) ? phi : (phi + 2 * Math.PI);
    }

    /**
     *  @see http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf
     */
    getStateInOwnFrameByEpoch(epoch) {
        let E = this.getEccentricAnomaly(epoch);
        let cos = Math.cos(E);
        let sin = Math.sin(E);

        let pos = new Vector3(
            this.sma * (cos - this.e),
            this.sma * Math.sqrt(1 - this.e * this.e) * sin,
            0
        );

        let koeff = this.meanMotion * this.sma / (1 - this.e * cos);
        let vel = new Vector3(
            -koeff * sin,
            koeff * Math.sqrt(1 - this.e * this.e) * cos,
            0
        );

        pos = pos.rotateZ(this.aop).rotateX(this.inc).rotateZ(this.raan);
        vel = vel.rotateZ(this.aop).rotateX(this.inc).rotateZ(this.raan);

        return new StateVector(
            pos.x, pos.y, pos.z,
            vel.x, vel.y, vel.z
        );
    }

    render(epoch) {
        const endingBrightness = 0.15;
        let centerPos = this.referenceFrame.transformPositionByEpoch(epoch, ZERO_VECTOR, RF_BASE);
        let dr = -this.sma * this.e;
        let ta = this.getTrueAnomaly(epoch);
        let mainColor = new THREE.Color(this.color);
        let lastVertexIdx;
        let ang = Math.acos(
            (this.e + Math.cos(ta)) / (1 + this.e * Math.cos(ta))
        );

        if (ta > Math.PI) {
            ang = 2 * Math.PI - ang;
        }

        this.threeObj.geometry = (new THREE.Path(
            (new THREE.EllipseCurve(
                dr * Math.cos(this.aop),
                dr * Math.sin(this.aop),
                this.sma,
                this.sma * Math.sqrt(1 - this.e * this.e),
                ang,
                2 * Math.PI + ang - 0.0000000000001,  // protection from rounding errors
                false,
                this.aop
            )).getPoints(100)
        )).createPointsGeometry(100).rotateX(this.inc);

        lastVertexIdx = this.threeObj.geometry.vertices.length - 1;

        for (let i = 0; i <= lastVertexIdx; i++) {
            let curColor = (new THREE.Color()).copy(mainColor);
            let mult = endingBrightness + (1 - endingBrightness) * i / lastVertexIdx;
            
            this.threeObj.geometry.colors.push(
                curColor.multiplyScalar(mult)
            );
        }

        this.threeObj.rotation.z = this.raan;

        this.threeObj.position.set(centerPos.x, centerPos.y, centerPos.z);
    }
}

class TrajectoryStateArray extends TrajectoryAbstract
{
    constructor(referenceFrame) {
        super(referenceFrame);

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

    getStateInOwnFrameByEpoch(epoch) {
        // @todo implement
    }
}
