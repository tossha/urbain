class ReferenceFrame
{
    constructor(origin, type) {
        this.origin = origin;
        this.type = type || RF_TYPE_ECLIPTIC; // RF_TYPE_EQUATORIAL, RF_TYPE_ECLIPTIC или RF_TYPE_ROTATING
        
        switch (type) {
            case RF_TYPE_EQUATORIAL:
                this.quaternion = EQUATORIAL_QUATERNION;
                break;
                
            default:
                this.quaternion = IDENTITY_QUATERNION;
                break;
        }
    }

    transformStateVectorByEpoch(epoch, state, destinationFrame) {
        if ((this.type === RF_TYPE_ROTATING)
            || (destinationFrame.type === RF_TYPE_ROTATING)
        ) {
            // @todo implement
            console.log('Rotating frames are not supported yet');
            return;
        }

        if (this === destinationFrame) {
            return state;
        }
        
        const rotation = new THREE.Quaternion();
        rotation.copy(destinationFrame.quaternion);
        rotation.inverse();
        rotation.multiply(this.quaternion);
        
        const state1 = TRAJECTORIES[this.origin].getStateByEpoch(epoch, RF_BASE);
        const state2 = TRAJECTORIES[destinationFrame.origin].getStateByEpoch(epoch, RF_BASE);
        
        const statePosThreeVec = vectorToThreeVector(state.position).applyQuaternion(rotation);
        const stateVelThreeVec = vectorToThreeVector(state.velocity).applyQuaternion(rotation);
        
        const diffPos = state1.position.sub(state2.position);
        const diffVel = state1.velocity.sub(state2.velocity);
        const statePosRotated = threeVectorToVector(statePosThreeVec);
        const stateVelRotated = threeVectorToVector(stateVelThreeVec);
        
        return new StateVector(
            statePosRotated.x + diffPos.x,
            statePosRotated.y + diffPos.y,
            statePosRotated.z + diffPos.z,
            stateVelRotated.x + diffVel.x,
            stateVelRotated.y + diffVel.y,
            stateVelRotated.z + diffVel.z
        );
    }

    transformPositionByEpoch(epoch, pos, destinationFrame) {
        return this.transformStateVectorByEpoch(
            epoch,
            new StateVector(pos.x, pos.y, pos.z, 0, 0, 0),
            destinationFrame
        ).position;
    }
}

ReferenceFrame.get = function(origin, type) {
    ReferenceFrame.collection = ReferenceFrame.collection || [];
    
    for (let rf of ReferenceFrame.collection) {
        if (rf.origin === origin && rf.type === type) {
            return rf;
        }
    }
    
    const rf = new ReferenceFrame(origin, type);
    ReferenceFrame.collection.push(rf);
    return rf;
};

class TrajectoryAbstract
{
    constructor(referenceFrame) {
        this.referenceFrame = referenceFrame || null; // class ReferenceFrame
    }

    drop() {
        if (this.visualModel) {
            this.visualModel.drop();
        }

        for (let trajIdx in TRAJECTORIES) {
            if (this === TRAJECTORIES[trajIdx]) {
                delete TRAJECTORIES[trajIdx];
                break;
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

    render(epoch) {
        if (this.visualModel) {
            this.visualModel.render(epoch);
        }
    }
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
    constructor(referenceFrame, mu, sma, e, inc, raan, aop, anomaly, epoch, color, isAnomalyTrue) {
        super(referenceFrame);

        this._mu    = mu;
        this._sma   = sma;
        this._e     = e;
        this._inc   = inc;
        this._raan  = raan;
        this._aop   = aop;
        this._epoch = epoch;

        if ((isAnomalyTrue === undefined) || (isAnomalyTrue === true)) {
            this.ta = anomaly;
        } else {
            this.m0 = anomaly;
        }
		
        this.updateMeanMotion();

        if (color) {
            this.visualModel = new VisualTrajectoryModelKeplerianOrbit(this, color);
        }
    }

    updateMeanMotion() {
        this.meanMotion = Math.sqrt(this._mu / this._sma) / this._sma;
    }

    get mu() {
        return this._mu;
    }

    set mu(value) {
        this._mu = value;
        this.updateMeanMotion();
    }

    get sma() {
        return this._sma;
    }

    set sma(value) {
        this._sma = value;
        this.updateMeanMotion();
    }

    get e() {
        return this._e;
    }

    set e(value) {
        this._e = value;
    }

    get inc() {
        return this._inc;
    }

    set inc(value) {
        this._inc = value;
    }

    get raan() {
        return this._raan;
    }

    set raan(value) {
        this._raan = value;
    }

    get aop() {
        return this._aop;
    }

    set aop(value) {
        this._aop = value;
    }

    get ta() {
        return this.getTrueAnomaly(this._epoch);
    }

    set ta(value) {
        this.m0 = this.getMeanAnomalyByTrueAnomaly(value);
    }

    get epoch() {
        return this._epoch;
    }

    set epoch(value) {
        this._epoch = value;
    }

    getEccentricAnomalyByTrueAnomaly(ta) {
        const cos = Math.cos(ta);
        const sin = Math.sin(ta);
        const cosE = (this._e + cos) / (1 + this._e * cos);
        const sinE = Math.sqrt(1 - this._e * this._e) * sin / (1 + this._e * cos);
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
        return ea - this._e * Math.sin(ea);
    }

    getMeanAnomaly(epoch) {
        return this.m0 + this.meanMotion * (epoch - this._epoch);
    }

    getEccentricAnomaly(epoch) {
        let M = this.getMeanAnomaly(epoch) / (2.0 * Math.PI);
        let maxIter = 30, i = 0;
        let delta = 0.00000001;
        let E, F;

        M = 2.0 * Math.PI * (M - Math.floor(M));

        E = (this._e < 0.8) ? M : Math.PI;

        F = E - this._e * Math.sin(M) - M;

        while ((Math.abs(F) > delta) && (i < maxIter)) {
            E = E - F / (1.0 - this._e * Math.cos(E));
            F = E - this._e * Math.sin(E) - M;
            i = i + 1;
        }

        return E;
    }

    getTrueAnomaly(epoch) {
        let E = this.getEccentricAnomaly(epoch);
        let phi = Math.atan2(Math.sqrt(1.0 - this._e * this._e) * Math.sin(E), Math.cos(E) - this._e);
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
            this._sma * (cos - this._e),
            this._sma * Math.sqrt(1 - this._e * this._e) * sin,
            0
        );

        let koeff = this.meanMotion * this._sma / (1 - this._e * cos);
        let vel = new Vector3(
            -koeff * sin,
            koeff * Math.sqrt(1 - this._e * this._e) * cos,
            0
        );

        pos = pos.rotateZ(this._aop).rotateX(this._inc).rotateZ(this._raan);
        vel = vel.rotateZ(this._aop).rotateX(this._inc).rotateZ(this._raan);

        return new StateVector(
            pos.x, pos.y, pos.z,
            vel.x, vel.y, vel.z
        );
    }
	
    static createByState (referenceFrame, state, mu, epoch, color) {
        var pos = state.position;
		var vel = state.velocity;
		
		var angMomentum = pos.mulCrossByVector(vel);
    
        var raan = Math.atan2(angMomentum.x, -angMomentum.y); //raan
        var inc = Math.atan2((Math.sqrt(Math.pow(angMomentum.x, 2) + Math.pow(angMomentum.y, 2))) , angMomentum.z); //inclination
    
        var sma = (mu * pos.mag) / (2.0 * mu - pos.mag * Math.pow(vel.mag, 2)); //semimajor axis
        var e = Math.sqrt(1.0 - (Math.pow(angMomentum.mag, 2) / (mu * sma))); //eccentricity
    
        var p = pos.rotateZ(-raan).rotateX(-inc);
        var u = Math.atan2(p.y , p.x);
    
        var radVel = pos.mulDotByVector(vel) / pos.mag;
        var cosE = (sma - pos.mag) / (sma * e);
        var sinE = (pos.mag * radVel) / (e * Math.sqrt(mu * sma));
        var ta = Math.atan2((Math.sqrt(1.0 - e * e) * sinE) , (cosE - e));
        ta = (ta > 0) ? ta : (ta + 2 * Math.PI);
    
        var E = (sinE < 0) ? Math.acos (cosE) : (2 * Math.PI - Math.acos (cosE));
    
        var aop = ((u - ta) > 0) ? (u - ta) : 2 * Math.PI + (u - ta); //argument of periapsis
        var m0 = 2 * Math.PI - (E - e * sinE); //mean anomaly
		
		return new TrajectoryKeplerianOrbit(
            referenceFrame, 
            mu, 
            sma, 
            e, 
            inc, 
            raan, 
            aop, 
            m0, 
            epoch, 
            color, 
            false)
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
            this.visualModel = new VisualTrajectoryModelStateArray(this, color);
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
