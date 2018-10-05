import {Quaternion, TWO_PI, Vector} from "./algebra";
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

    setUpdateCallback(callback) {
        this.updateCallback = callback;
    }

    copy() {
        return new KeplerianObject(this._e, this._sma, this._aop, this._inc, this._raan, this.m0, this._epoch, this._mu, false);
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
        this.updateCallback && this.updateCallback();
    }

    get sma() {
        return this._sma;
    }

    set sma(value) {
        this._sma = value;
        this.updateMeanMotion();
        this.updateCallback && this.updateCallback();
    }

    get e() {
        return this._e;
    }

    set e(value) {
        this._e = value;
        this.updateCallback && this.updateCallback();
    }

    get ecc() {
        return this._e;
    }

    set ecc(value) {
        this.e = value;
    }

    get inc() {
        return this._inc;
    }

    set inc(value) {
        this._inc = value;
        this.updateCallback && this.updateCallback();
    }

    get raan() {
        return this._raan;
    }

    set raan(value) {
        this._raan = value;
        this.updateCallback && this.updateCallback();
    }

    get aop() {
        return this._aop;
    }

    set aop(value) {
        this._aop = value;
        this.updateCallback && this.updateCallback();
    }

    get ta() {
        return this.getTrueAnomalyByEpoch(this._epoch);
    }

    set ta(value) {
        this.m0 = this.getMeanAnomalyByTrueAnomaly(value);
        this.updateCallback && this.updateCallback();
    }

    get epoch() {
        return this._epoch;
    }

    set epoch(value) {
        this._epoch = value;
        this.updateCallback && this.updateCallback();
    }

    get period() {
        if (!this.isElliptic) {
            return 0;
        }
        return 2 * Math.PI * Math.sqrt(this._sma * this._sma * this._sma / this._mu);
    }

    getNodalPrecessionRate(r, j2) {
        return -3/2 * r * r * j2 * Math.cos(this.inc) * this.meanMotion / Math.pow(this.sma * (1 - this.e * this.e), 2);
    }

    getNodalPrecessionByEpoch(r, j2, epoch) {
        return (epoch - this._epoch) * this.getNodalPrecessionRate(r, j2);
    }

    addPrecession(r, j2, epoch) {
        this.m0 = this.getMeanAnomalyByEpoch(epoch);
        this._raan += this.getNodalPrecessionByEpoch(r, j2, epoch);
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
            const cosE = (this._e + cos) / (1 + this._e * cos);
            return ((ta + TWO_PI) % TWO_PI <= Math.PI)
                ? Math.acos(cosE)
                : TWO_PI - Math.acos(cosE);
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
            return (phi >= 0) ? phi : (phi + 2 * Math.PI);
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

    getPeriapsisRadius() {
        return this._sma * (1 - this._e);
    }

    getApoapsisRadius() {
        return this._sma * (1 + this._e);
    }

    getPeriapsisSpeed() {
        return Math.sqrt(this._mu * (2 / this.getPeriapsisRadius() - 1 / this._sma));
    }

    getApoapsisSpeed() {
        return Math.sqrt(this._mu * (2 / this.getApoapsisRadius() - 1 / this._sma));
    }

    getEpochByTrueAnomaly(ta) {
        if (ta === null) {
            return null;
        }
        let diff = this.getMeanAnomalyByTrueAnomaly(ta) - this.m0;
        if (diff < 0 && this.isElliptic) {
            diff += TWO_PI;
        }
        return this._epoch + diff / this.meanMotion;
    }

    getSphereCrossingTrueAnomaly(radius) {
        const apoR = this.getApoapsisRadius();
        if ((apoR > 0 && radius > apoR) || radius < this.getPeriapsisRadius()) {
            return false;
        }
        const ta = Math.acos((this._sma * (1.0 - this._e * this._e) / radius - 1) / this._e);
        return [ta, TWO_PI - ta];
    }

    getPlaneCrossingTrueAnomaly(distanceToPlane) {
        const a = this._sma * (1 - this._e * this._e) * Math.sin(this._inc) / distanceToPlane;
        const b = this._e;
        const c = Math.cos(this._aop);
        const d = Math.sin(this._aop);
        let taHigh = this._planeCrossingHelper( a * c,  a * d - b);  // top boundary
        let taLow  = this._planeCrossingHelper(-a * c, -a * d - b);  // bottom boundary
        let range1 = null;
        let range2 = null;

        if (taHigh === false && taLow === false) {
            return false;
        }

        if (this.isHyperbolic) {
            if (taHigh instanceof Array) {
                if (!taLow instanceof Array) {
                    return [taHigh];
                }
                return [
                    [Math.min(taHigh[0], taLow[0]), Math.max(taHigh[0], taLow[0])],
                    [Math.min(taHigh[1], taLow[1]), Math.max(taHigh[1], taLow[1])]
                ];
            }
            if (taLow instanceof Array) {
                return [taLow];
            }
            if (taHigh !== false && taLow !== false) {
                return [[Math.min(taLow, taHigh), Math.max(taLow, taHigh)]];
            }
            // TODO implement
            // this is a rare case where either taHigh or taLow is a number,
            // which means that hyperbola asymptote is parallel to the horizontal plane
            console.log('Error! getPlaneCrossingTrueAnomaly() not implemented!');
            return false;
        }

        if (taHigh !== false) {
            if (((this._aop + taHigh[0]) % TWO_PI) < ((this._aop + taHigh[1]) % TWO_PI)) {
                range1 = [taHigh[1], taHigh[0]];
            } else {
                range1 = [taHigh[0], taHigh[1]];
            }
        }

        if (taLow !== false) {
            if (((this._aop + taLow[0]) % TWO_PI) < ((this._aop + taLow[1]) % TWO_PI)) {
                range2 = [taLow[1], taLow[0]];
            } else {
                range2 = [taLow[0], taLow[1]];
            }
            return range1
                ? [
                    [range1[0], range2[1]],
                    [range2[0], range1[1]]
                ]
                : [range2];
        }

        return [range1];
    }

    _planeCrossingHelper(a, b) {
        const temp1 = a*a + b*b;
        const temp2 = Math.sqrt(a*a * (temp1 - 1));
        let ta1 = Math.atan2(
            ((b * temp2 - b*b) / temp1 + 1) / a,
            (b - temp2) / temp1
        );

        if (isNaN(ta1)) {
            return false;
        }

        let ta2 = Math.atan2(
            ((-b * temp2 - b*b) / temp1 + 1) / a,
            (b + temp2) / temp1
        );
        if (this.isElliptic) {
            return [
                ta1 < 0 ? ta1 + TWO_PI : ta1,
                ta2 < 0 ? ta2 + TWO_PI : ta2
            ];
        } else {
            const asymptote = this.getAsymptoteTa();
            ta1 = this._validateHyperbolicTa(asymptote, ta1);
            ta2 = this._validateHyperbolicTa(asymptote, ta2);
            if (ta1 !== false && ta2 !== false && ta1 !== ta2) {
                return [Math.min(ta1, ta2), Math.max(ta1, ta2)];
            } else if (ta1 !== false) {
                return ta1;
            } else if (ta2 !== false) {
                return ta2;
            } else {
                return false;
            }
        }
    }

    _validateHyperbolicTa(asymptote, ta) {
        if (ta > Math.PI) {
            ta -= TWO_PI;
        }
        if (ta > asymptote || ta < -asymptote) {
            return false;
        }
        if (Math.abs(ta - Math.sign(ta) * asymptote) < 1e-14) {
            return false;
        }
        return ta;
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
        const normalQuaternion = new Quaternion(nodeQuaternion.rotate_(new Vector([1, 0, 0])), this._inc);

        return normalQuaternion.rotate_(new Vector([0, 0, 1]));
    }

    getPeriapsisVector() {
        return this.getOrbitalFrameQuaternion().rotate_(new Vector([1, 0, 0]));
    }

    getOrbitalFrameQuaternion() {
        return (new Quaternion(new Vector([0, 0, 1]), this._raan))
            .mul_(new Quaternion(new Vector([1, 0, 0]), this._inc))
            .mul_(new Quaternion(new Vector([0, 0, 1]), this._aop))
        ;
    }

    /**
     *  @see http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf
     */
    static createFromState(state, mu, epoch) {
        epoch = epoch || 0;

        if (!state) {
            return null;
        }

        const pos = state.position;
        const vel = state.velocity;

        const angMomentum = pos.cross(vel);

        const raan = Math.atan2(angMomentum.x, -angMomentum.y);
        const inc = Math.atan2((Math.sqrt(Math.pow(angMomentum.x, 2) + Math.pow(angMomentum.y, 2))) , angMomentum.z);
        const sma = (mu * pos.mag) / (2.0 * mu - pos.mag * Math.pow(vel.mag, 2));
        const e = Math.sqrt(1.0 - Math.min(1, Math.pow(angMomentum.mag, 2) / (mu * sma)));

        const p = pos.rotateZ(-raan).rotateX(-inc);
        const u = Math.atan2(p.y , p.x);

        const radVel = pos.dot(vel);
        const ta = Math.acos(Math.min(1, Math.max(-1, (sma*(1 - e*e) / pos.mag - 1) / e))) * Math.sign(radVel);

        const aop = ((u - ta) > 0) ? (u - ta) : 2 * Math.PI + (u - ta);

        return new KeplerianObject(e, sma, aop, inc, raan, ta, epoch, mu, true);
    }

}
