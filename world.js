
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
    
    drop() {
        for (let trajIdx in TRAJECTORIES) {
            if (this === TRAJECTORIES[trajIdx]) {
                TRAJECTORIES[trajIdx] = undefined;
            }
        }
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
    constructor(referenceFrame, mu, sma, e, inc, raan, aop, ta, epoch, color) {
        super(referenceFrame);

        this.mu     = mu;
        this.sma    = sma;
        this.e      = e;
        this.inc    = inc;
        this.raan   = raan;
        this.aop    = aop;
        this.epoch  = epoch;
        this.color  = color;

        this.m0 = this.getMeanAnomalyByTrueAnomaly(ta);

        this.meanMotion = Math.sqrt(mu / sma) / sma;

        if (color) {
            // @todo remove this from here
            this.threeObj = new THREE.Line(
                new THREE.Geometry(),
                new THREE.LineBasicMaterial({color: this.color, vertexColors: THREE.VertexColors})
            );

            scene.add(this.threeObj);
        }
    }

    drop() {
        super.drop();
        scene.remove(this.threeObj);
        this.threeObj.geometry.dispose();
        this.threeObj.material.dispose();
        this.threeObj = null;
    }
    
    getEccentricAnomalyByTrueAnomaly(ta) {
        const cos = Math.cos(ta);
        const sin = Math.sin(ta);
        const cosE = (this.e + cos) / (1 + this.e * cos);
        const sinE = Math.sqrt(1 - this.e * this.e) * sin / (1 + this.e * cos);
        const ang = Math.acos(cosE);

        return (sinE > 0)
            ? ang
            : (2 * Math.PI - ang);
    }
    
    getMeanAnomalyByTrueAnomaly(ta) {
        return this.getMeanAnomalyByEccentricAnomaly(
            this.getEccentricAnomalyByTrueAnomaly(ta)
        );
    }

    getMeanAnomalyByEccentricAnomaly(ea) {
        return ea - this.e * Math.sin(ea);
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
        if (!this.color) {
            return;
        }

        const endingBrightness = 0.35;
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

        this.threeObj.geometry.dispose();
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
    constructor(referenceFrame, color) {
        super(referenceFrame);

        this.states = []; // array of [epoch, class StateVector]
        this.minEpoch = null;
        this.maxEpoch = null;
        this.color = color;
        
        if (color) {
            this.threeObj = new THREE.Line(
                new THREE.Geometry(),
                new THREE.LineBasicMaterial({ color: this.color, vertexColors: THREE.VertexColors })
            );
            
            scene.add(this.threeObj);
        }
    }

    addState(epoch, state) {
        this.states.push({
            epoch: epoch,
            state: state
        });
        
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
        if ((this.minEpoch === null)
            || (this.maxEpoch === null)
            || (epoch < this.minEpoch)
            || (this.maxEpoch < epoch)
        ) {
            return null;
        }
        
        // Поиск перебором. Потом можно заменить на бинпоиск, но сейчас это неоправданно усложнит код
        for (let i = 1; i < this.states.length; ++i) {
            const next = this.states[i];
            if (next.epoch < epoch) {
                continue;
            }
            
            const prev = this.states[i - 1];
            // Ускорение -- отношение изменения скорости ко времени, за которое оно произошло
            const acceleration = next.state.velocity.sub(prev.state.velocity).div(next.epoch - prev.epoch);
            const timeDiff = epoch - prev.epoch;
            /* Считаем скорость и положение на данном отрезке по формулам для равноускоренного движения,
               так как на заданном малом промежутке времени движение можно считать равноускоренным:
               v1 = v0 + a * t
               r1 = r0 + (v0 + v1) / 2 * t
               Где v1 -- новый вектор скорости, v0 -- предыдущий вектор скорости,
               a -- вектор ускорения, t -- время, за которое произошло движение,
               r1 -- новый вектор положения, r0 -- предыдущий вектор положения */
            const newVelocity = acceleration.mul(timeDiff).add(prev.state.velocity);
            const newPosition = newVelocity.add(prev.state.velocity).
                    mul(timeDiff / 2).add(prev.state.position);
            return new StateVector(
                newPosition.x, newPosition.y, newPosition.z,
                newVelocity.x, newVelocity.y, newVelocity.z);
        }
    }
    
    render(epoch) {
        if (!this.threeObj || this.states.length < 2) {
            return;
        }

        this.threeObj.geometry.dispose();
        const geometry = new THREE.Geometry();
        for (let i = 0; i < this.states.length; ++i) {
            const position = this.states[i].state.position;
            geometry.vertices.push(new THREE.Vector3(
                position.x,
                position.y,
                position.z
            ));
            geometry.colors.push(new THREE.Color(this.color));
        }

        this.threeObj.geometry = geometry;
    }
}

class Orientation
{
    constructor(epoch, axisOrientation, angularVel) {
        this.epoch = epoch;
        this.axisOrientation = axisOrientation;
        this.angularVel = angularVel;
    }

    getOrientationByEpoch(epoch) {
        return (new THREE.Quaternion())
            .copy(this.axisOrientation)
            .multiply(getQuaternionByEuler(
                0,
                0,
                (epoch - this.epoch) * this.angularVel
            ));
    }
}
