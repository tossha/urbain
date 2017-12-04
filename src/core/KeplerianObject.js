import {getAngleBySinCos, Quaternion, Vector} from "../algebra";
import StateVector from "./StateVector";

export default class KeplerianObject
{
    constructor(e, sma, aop, inc, raan, anomaly, epoch, mu, isAnomalyTrue) {
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
    }

    copy() {
        return new KeplerianObject(this._e, this._sma, this._aop, this._raan, this.m0, this._epoch, this._mu, false);
    }

    updateMeanMotion() {
        this.meanMotion = Math.sqrt(this._mu / Math.abs(this._sma)) / Math.abs(this._sma);
    }

    get isHyperbolic() {
        return this._e > 1;
    }

    get isElliptic() {
        return this._e < 1;
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
        return this.getTrueAnomalyByEpoch(this._epoch);
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

    addPrecession(r, j2, epoch) {
        const rate = -3/2 * r * r * j2 * Math.cos(this.inc) * this.meanMotion / Math.pow(this.sma * (1 - this.e * this.e), 2);
        this.m0 = this.getMeanAnomalyByEpoch(epoch);
        this.raan += rate * (epoch - this._epoch);
        this._epoch = epoch;
        return this;
    }

    getMeanAnomalyByEpoch(epoch) {
        return this.m0 + this.meanMotion * (epoch - this._epoch);
    }

    getEccentricAnomalyByEpoch(epoch) {
        return this.getEccentricAnomalyByMeanAnomaly(
            this.getMeanAnomalyByEpoch(epoch)
        );
    }

    getTrueAnomalyByEpoch(epoch) {
        return this.getTrueAnomalyByMeanAnomaly(
            this.getMeanAnomalyByEpoch(epoch)
        );
    }

    getMeanAnomalyByEccentricAnomaly(ea) {
        if (this.isElliptic) {
            return ea - this._e * Math.sin(ea);
        } else {
            return this._e * Math.sinh(ea) - ea;
        }
    }

    getMeanAnomalyByTrueAnomaly(ta) {
        return this.getMeanAnomalyByEccentricAnomaly(
            this.getEccentricAnomalyByTrueAnomaly(ta)
        );
    }

    getEccentricAnomalyByMeanAnomaly(ma) {
        const maxIter = 30;
        const delta = 0.00000001;
        let M = ma;
        let E, F, i = 0;

        if (this.isElliptic) {
            M = M / (2.0 * Math.PI);
            M = 2.0 * Math.PI * (M - Math.floor(M));

            E = (this._e < 0.8) ? M : Math.PI;

            F = E - this._e * Math.sin(E) - M;

            while ((Math.abs(F) > delta) && (i < maxIter)) {
                E = E - F / (1.0 - this._e * Math.cos(E));
                F = E - this._e * Math.sin(E) - M;
                i = i + 1;
            }
        } else {
            E = (Math.log(2 * (Math.abs(M) + 1/3)) + 1) / this._e + (1 - 1 / this._e) * Math.asinh(Math.abs(M) / this._e);
            E *= Math.sign(M);

            F = this._e * Math.sinh(E) - E - M;

            while ((Math.abs(F) > delta) && (i < maxIter)) {
                E = E - F / (this._e * Math.cosh(E) - 1);
                F = this._e * Math.sinh(E) - E - M;
                i = i + 1;
            }
        }

        return E;
    }

    getEccentricAnomalyByTrueAnomaly(ta) {
        if (this.isElliptic) {
            const cos = Math.cos(ta);
            const sin = Math.sin(ta);
            const cosE = (this._e + cos) / (1 + this._e * cos);
            const sinE = Math.sqrt(1 - this._e * this._e) * sin / (1 + this._e * cos);

            return getAngleBySinCos(sinE, cosE);
        } else {
            return 2 * Math.atanh(Math.tan(ta / 2) / Math.sqrt((this._e + 1) / (this._e - 1)));
        }
    }

    getTrueAnomalyByMeanAnomaly(ma) {
        return this.getTrueAnomalyByEccentricAnomaly(
            this.getEccentricAnomalyByMeanAnomaly(ma)
        );
    }

    getTrueAnomalyByEccentricAnomaly(ea) {
        if (this.isElliptic) {
            const phi = Math.atan2(Math.sqrt(1.0 - this._e * this._e) * Math.sin(ea), Math.cos(ea) - this._e);
            return (phi > 0) ? phi : (phi + 2 * Math.PI);
        } else {
            return 2 * Math.atan(Math.sqrt((this._e + 1) / (this._e - 1)) * Math.tanh(ea / 2));
        }
    }

    getOwnCoordsByTrueAnomaly(ta) {
        const r = this._sma * (1.0 - this._e * this._e) / (1 + this._e * Math.cos(ta));
        return new Vector([r * Math.cos(ta), r * Math.sin(ta), 0]);
    }

    getAsymptoteTa() {
        if (this.isElliptic) {
            return false;
        }
        return Math.acos(-1 / this._e);
    }

    /**
     *  @see http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf
     */
    getStateByEpoch(epoch) {
        if (this.isElliptic) {
            const ea = this.getEccentricAnomalyByEpoch(epoch);
            const cos = Math.cos(ea);
            const sin = Math.sin(ea);
            const koeff = Math.sqrt(this._mu / this._sma) / (1 - this._e * cos);

            let pos = new Vector([
                this._sma * (cos - this._e),
                this._sma * Math.sqrt(1 - this._e * this._e) * sin,
                0
            ]);

            let vel = new Vector([
                -koeff * sin,
                koeff * Math.sqrt(1 - this._e * this._e) * cos,
                0
            ]);

            return new StateVector(
                pos.rotateZ(this._aop).rotateX(this._inc).rotateZ(this._raan),
                vel.rotateZ(this._aop).rotateX(this._inc).rotateZ(this._raan)
            );
        } else {
            const ta = this.getTrueAnomalyByEpoch(epoch);
            const orbitalQuat = this.getOrbitalFrameQuaternion();
            const pos = this.getOwnCoordsByTrueAnomaly(ta);
            const flightPathAngle = Math.atan(this._e * Math.sin(ta) / (1 + this._e * Math.cos(ta)));
            let vel = new Vector([Math.sqrt(this._mu * (2 / pos.mag - 1 / this._sma)), 0, 0]);

            return new StateVector(
                orbitalQuat.rotate_(pos),
                orbitalQuat.rotate_(vel.rotateZ(ta + Math.PI / 2 - flightPathAngle)),
            );
        }
    }

    getNormalVector() {
        const nodeQuaternion = new Quaternion(new Vector([0, 0, 1]), this._raan);
        const normalQuaternion = new Quaternion(nodeQuaternion.rotate(new Vector([1, 0, 0])), this._inc);

        return normalQuaternion.rotate(new Vector([0, 0, 1]));
    }

    getOrbitalFrameQuaternion() {
        return (new Quaternion(new Vector([0, 0, 1]), this._raan))
            .mul(new Quaternion(new Vector([1, 0, 0]), this._inc))
            .mul(new Quaternion(new Vector([0, 0, 1]), this._aop))
        ;
    }

    getPeriapsisVector() {
        return this.getOrbitalFrameQuaternion().rotate_(new Vector([1, 0, 0]));

    }

    /**
     *  @see http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf
     */
    static createFromState(state, mu, epoch) {
        epoch = epoch || 0;

        const pos = state.position;
        const vel = state.velocity;

        const angMomentum = pos.cross(vel);

        const raan = Math.atan2(angMomentum.x, -angMomentum.y);
        const inc = Math.atan2((Math.sqrt(Math.pow(angMomentum.x, 2) + Math.pow(angMomentum.y, 2))) , angMomentum.z);
        const sma = (mu * pos.mag) / (2.0 * mu - pos.mag * Math.pow(vel.mag, 2));
        const e = Math.sqrt(1.0 - (Math.pow(angMomentum.mag, 2) / (mu * sma)));

        const p = pos.rotateZ(-raan).rotateX(-inc);
        const u = Math.atan2(p.y , p.x);

        const radVel = pos.dot(vel);
        const ta = Math.acos((sma*(1 - e*e) / pos.mag - 1) / e) * Math.sign(radVel);

        const aop = ((u - ta) > 0) ? (u - ta) : 2 * Math.PI + (u - ta);

        return new KeplerianObject(e, sma, aop, inc, raan, ta, epoch, mu, true);
    }

}