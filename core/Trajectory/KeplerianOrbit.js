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

    static createByState(referenceFrame, state, mu, epoch, color) {
        let pos = state.position;
        let vel = state.velocity;

        let angMomentum = pos.mulCrossByVector(vel);

        let raan = Math.atan2(angMomentum.x, -angMomentum.y); //raan
        let inc = Math.atan2((Math.sqrt(Math.pow(angMomentum.x, 2) + Math.pow(angMomentum.y, 2))) , angMomentum.z); //inclination

        let sma = (mu * pos.mag) / (2.0 * mu - pos.mag * Math.pow(vel.mag, 2)); //semimajor axis
        let e = Math.sqrt(1.0 - (Math.pow(angMomentum.mag, 2) / (mu * sma))); //eccentricity

        let p = pos.rotateZ(-raan).rotateX(-inc);
        let u = Math.atan2(p.y , p.x);

        let radVel = pos.mulDotByVector(vel) / pos.mag;
        let cosE = (sma - pos.mag) / (sma * e);
        let sinE = (pos.mag * radVel) / (e * Math.sqrt(mu * sma));
        let ta = Math.atan2((Math.sqrt(1.0 - e * e) * sinE) , (cosE - e));
        ta = (ta > 0) ? ta : (ta + 2 * Math.PI);

        let E = (sinE < 0) ? Math.acos (cosE) : (2 * Math.PI - Math.acos (cosE));

        let aop = ((u - ta) > 0) ? (u - ta) : 2 * Math.PI + (u - ta); //argument of periapsis
        let m0 = 2 * Math.PI - (E - e * sinE); //mean anomaly

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
            false
        );
    }
}
