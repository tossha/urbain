
import TrajectoryKeplerianAbstract from "./KeplerianAbstract";
import ReferenceFrameFactory from "../ReferenceFrame/Factory";
import {ReferenceFrame} from "../ReferenceFrame/Factory";
import {EARTH} from "../../solar_system";
import {deg2rad, Vector} from "../../algebra";
import StateVector from "../StateVector";
import KeplerianObject from "../KeplerianObject";

export default class TrajectoryELP2000 extends TrajectoryKeplerianAbstract
{
    constructor(coefficients) {
        super(ReferenceFrameFactory.buildId(EARTH, ReferenceFrame.INERTIAL_ECLIPTIC));
        this.coefficients = coefficients;
        this.mu = sim.starSystem.getObject(EARTH).physicalModel.mu;
        this._p = 5029.0966;
    }

    getKeplerianObjectByEpoch(epoch) {
        return KeplerianObject.createFromState(this.getStateInOwnFrameByEpoch(epoch), this.mu, epoch);
    }

    getStateInOwnFrameByEpoch(epoch) {
        const model = this._calcAll(epoch / 86400 / 36525);
        const sinLon = Math.sin(model.lon);
        const sinLat = Math.sin(model.lat);
        const cosLon = Math.cos(model.lon);
        const cosLat = Math.cos(model.lat);

        return new StateVector(
            new Vector([
                model.r * cosLon * cosLat,
                model.r * sinLon * cosLat,
                model.r * sinLat
            ]),
            new Vector([
                (model.dr * cosLon * cosLat - model.r * sinLon * cosLat * model.dlon - model.r * cosLon * sinLat * model.dlat) / 36525 / 86400,
                (model.dr * sinLon * cosLat + model.r * cosLon * cosLat * model.dlon - model.r * sinLon * sinLat * model.dlat) / 36525 / 86400,
                (model.dr * sinLat + model.r * cosLat * model.dlat) / 36525 / 86400
            ])
        );
    }

    _calc1_3(fileIdx, t, t2, t3, t4) {
        const D  = 297 * 3600 + 51 * 60 +  0.73512 + 1602961601.4603 * t -  5.8681 * t2 + 0.006595 * t3 - 0.00003184 * t4;
        const dD = 1602961601.4603 - 5.8681 * 2 * t + 0.006595 * 3 * t2 - 0.00003184 * 4 * t3;
        const l_ = 357 * 3600 + 31 * 60 + 44.79306 +  129596581.0474 * t -  0.5529 * t2 + 0.000147 * t3;
        const dl_= 129596581.0474 - 0.5529 * 2 * t + 0.000147 * 3 * t2;
        const l  = 134 * 3600 + 57 * 60 + 48.28096 + 1717915923.4728 * t + 32.3893 * t2 + 0.051651 * t3 - 0.00024471 * t4;
        const dl = 1717915923.4728 + 32.3893 * 2 * t + 0.051651 * 3 * t2 - 0.00024471 * 4 * t3;
        const F  =  93 * 3600 + 16 * 60 + 19.55755 + 1739527263.0983 * t - 12.2505 * t2 - 0.001021 * t3 + 0.00000417 * t4;
        const dF = 1739527263.0983 - 12.2505 * 2 * t - 0.001021 * 3 * t2 + 0.00000417 * 4 * t3;

        let value = 0;
        let derivative = 0;

        for (let k of this.coefficients[fileIdx]) {
            const arg = deg2rad((k[0] * D + k[1] * l_ + k[2] * l + k[3] * F) / 3600);
            const dArg = k[0] * dD + k[1] * dl_ + k[2] * dl + k[3] * dF;
            const sin = Math.sin(arg);
            const cos = Math.cos(arg);
            value += k[4] * (fileIdx == 2 ? cos : sin);
            derivative += k[4] * (fileIdx == 2 ? -sin : cos) * deg2rad(dArg / 3600);
        }

        return [value, derivative];
    }
    
    _calc4_9(fileIdx, t, t2, t3, t4) {
        const D  = 297 * 3600 + 51 * 60 +  0.73512 + 1602961601.4603  * t;
        const dD = 1602961601.4603;
        const l_ = 357 * 3600 + 31 * 60 + 44.79306 +  129596581.0474  * t;
        const dl_= 129596581.0474;
        const l  = 134 * 3600 + 57 * 60 + 48.28096 + 1717915923.4728  * t;
        const dl = 1717915923.4728;
        const F  =  93 * 3600 + 16 * 60 + 19.55755 + 1739527263.0983  * t;
        const dF = 1739527263.0983;
        const W1 = 218 * 3600 + 18 * 60 + 59.95571 + 1732559343.73604 * t -  5.8883 * t2 + 0.006604 * t3 - 0.00003169 * t4;
        const dW1= 1732559343.73604 - 5.8883 * 2 * t + 0.006604 * 3 * t2 - 0.00003169 * 4 * t3;
        const z = W1 + this._p * t;
        const dz = dW1 + this._p;

        let value = 0;
        let derivative = 0;

        for (let k of this.coefficients[fileIdx]) {
            const arg = (k[0] * z + k[1] * D + k[2] * l_ + k[3] * l + k[4] * F) / 3600 + k[5];
            const dArg = k[0] * dz + k[1] * dD + k[2] * dl_ + k[3] * dl + k[4] * dF;
            value += k[6] * Math.sin(deg2rad(arg));
            derivative += k[6] * Math.cos(deg2rad(arg)) * deg2rad(dArg / 3600);
        }

        return [value, derivative];
    }

    _calc10_15(fileIdx, t, t2, t3, t4) {
        const D  = 297 * 3600 + 51 * 60 +  0.73512 + 1602961601.4603 * t;
        const dD = 1602961601.4603;
        const l  = 134 * 3600 + 57 * 60 + 48.28096 + 1717915923.4728 * t;
        const dl = 1717915923.4728;
        const F  =  93 * 3600 + 16 * 60 + 19.55755 + 1739527263.0983 * t;
        const dF = 1739527263.0983;
        const T  = 100 * 3600 + 27 * 60 + 59.22059 +  129597742.2758 * t;
        const dT =  129597742.2758;
        const Me = 252 * 3600 + 15 * 60 +  3.25986 + 538101628.68898 * t;
        const dMe= 538101628.68898;
        const V  = 181 * 3600 + 58 * 60 + 47.28305 + 210664136.43355 * t;
        const dV = 210664136.43355;
        const Ma = 355 * 3600 + 25 * 60 + 59.78866 +  68905077.59284 * t;
        const dMa=  68905077.59284;
        const J  =  34 * 3600 + 21 * 60 +  5.34212 +  10925660.42861 * t;
        const dJ =  10925660.42861;
        const S  =  50 * 3600 +  4 * 60 + 38.89694 +   4399609.65932 * t;
        const dS =   4399609.65932;
        const U  = 314 * 3600 +  3 * 60 + 18.01841 +   1542481.19393 * t;
        const dU =   1542481.19393;
        const N  = 304 * 3600 + 20 + 60 + 55.19575 +    786550.32074 * t;
        const dN =    786550.32074;

        let value = 0;
        let derivative = 0;

        for (let k of this.coefficients[fileIdx]) {
            const arg = (k[0] * Me + k[1] * V + k[2] * T + k[3] * Ma + k[4] * J + k[5] * S + k[6] * U + k[7] * N + k[8] * D + k[9] * l + k[10] * F) / 3600 + k[11];
            const dArg = k[0] * dMe + k[1] * dV + k[2] * dT + k[3] * dMa + k[4] * dJ + k[5] * dS + k[6] * dU + k[7] * dN + k[8] * dD + k[9] * dl + k[10] * dF;
            value += k[12] * Math.sin(deg2rad(arg));
            derivative += k[12] * Math.cos(deg2rad(arg)) * deg2rad(dArg / 3600);
        }

        return [value, derivative];
    }

    _calc16_21(fileIdx, t, t2, t3, t4) {
        const D  = 297 * 3600 + 51 * 60 +  0.73512 + 1602961601.4603 * t;
        const dD = 1602961601.4603;
        const l_ = 357 * 3600 + 31 * 60 + 44.79306 +  129596581.0474 * t;
        const dl_=  129596581.0474;
        const l  = 134 * 3600 + 57 * 60 + 48.28096 + 1717915923.4728 * t;
        const dl = 1717915923.4728;
        const F  =  93 * 3600 + 16 * 60 + 19.55755 + 1739527263.0983 * t;
        const dF = 1739527263.0983;
        const T  = 100 * 3600 + 27 * 60 + 59.22059 +  129597742.2758 * t;
        const dT =  129597742.2758;
        const Me = 252 * 3600 + 15 * 60 +  3.25986 + 538101628.68898 * t;
        const dMe= 538101628.68898;
        const V  = 181 * 3600 + 58 * 60 + 47.28305 + 210664136.43355 * t;
        const dV = 210664136.43355;
        const Ma = 355 * 3600 + 25 * 60 + 59.78866 +  68905077.59284 * t;
        const dMa=  68905077.59284;
        const J  =  34 * 3600 + 21 * 60 +  5.34212 +  10925660.42861 * t;
        const dJ =  10925660.42861;
        const S  =  50 * 3600 +  4 * 60 + 38.89694 +   4399609.65932 * t;
        const dS =   4399609.65932;
        const U  = 314 * 3600 +  3 * 60 + 18.01841 +   1542481.19393 * t;
        const dU =   1542481.19393;

        let value = 0;
        let derivative = 0;

        for (let k of this.coefficients[fileIdx]) {
            const arg = (k[0] * Me + k[1] * V + k[2] * T + k[3] * Ma + k[4] * J + k[5] * S + k[6] * U + k[7] * D + k[8] * l_ + k[9] * l + k[10] * F) / 3600 + k[11];
            const dArg = k[0] * dMe + k[1] * dV + k[2] * dT + k[3] * dMa + k[4] * dJ + k[5] * dS + k[6] * dU + k[7] * dD + k[8] * dl_ + k[9] * dl + k[10] * dF;
            value += k[12] * Math.sin(deg2rad(arg));
            derivative += k[12] * Math.cos(deg2rad(arg)) * deg2rad(dArg / 3600);
        }

        return [value, derivative];
    }

    _calc22_36(fileIdx, t, t2, t3, t4) {
        const D = 297 * 3600 + 51 * 60 + 0.73512 + 1602961601.4603 * t;
        const dD = 1602961601.4603;
        const l_ = 357 * 3600 + 31 * 60 + 44.79306 + 129596581.0474 * t;
        const dl_ = 129596581.0474;
        const l = 134 * 3600 + 57 * 60 + 48.28096 + 1717915923.4728 * t;
        const dl = 1717915923.4728;
        const F = 93 * 3600 + 16 * 60 + 19.55755 + 1739527263.0983 * t;
        const dF = 1739527263.0983;

        let value = 0;
        let derivative = 0;

        for (let k of this.coefficients[fileIdx]) {
            const arg = (k[1] * D + k[2] * l_ + k[3] * l + k[4] * F) / 3600 + k[5];
            const dArg = k[1] * dD + k[2] * dl_ + k[3] * dl + k[4] * dF;
            value += k[6] * Math.sin(deg2rad(arg));
            derivative += k[6] * Math.cos(deg2rad(arg)) * deg2rad(dArg / 3600);
        }

        return [value, derivative];
    }

    _calcFile(fileIdx, t, t2, t3, t4) {
        if (fileIdx < 3) {
            return this._calc1_3(fileIdx, t, t2, t3, t4);
        } else if (fileIdx < 6) {
            return this._calc4_9(fileIdx, t, t2, t3, t4);
        } else if (fileIdx < 9) {
            const res = this._calc4_9(fileIdx, t, t2, t3, t4);
            return [res[0] * t, res[1] * t + res[0]];
        } else if (fileIdx < 12) {
            return this._calc10_15(fileIdx, t, t2, t3, t4);
        } else if (fileIdx < 15) {
            const res = this._calc10_15(fileIdx, t, t2, t3, t4);
            return [res[0] * t, res[1] * t + res[0]];
        } else if (fileIdx < 18) {
            return this._calc16_21(fileIdx, t, t2, t3, t4);
        } else if (fileIdx < 21) {
            const res = this._calc16_21(fileIdx, t, t2, t3, t4);
            return [res[0] * t, res[1] * t + res[0]];
        } else if (fileIdx < 24) {
            return this._calc22_36(fileIdx, t, t2, t3, t4);
        } else if (fileIdx < 27) {
            const res = this._calc22_36(fileIdx, t, t2, t3, t4);
            return [res[0] * t, res[1] * t + res[0]];
        } else if (fileIdx < 33) {
            return this._calc22_36(fileIdx, t, t2, t3, t4);
        } else if (fileIdx < 36) {
            const res = this._calc22_36(fileIdx, t, t2, t3, t4);
            return [res[0] * t2, res[1] * t2 + res[0] * 2 * t];
        }
        return null;
    }

    _calcAll(t) {
        let lon  = 0;
        let dlon = 0;
        let lat  = 0;
        let dlat = 0;
        let r    = 0;
        let dr   = 0;
        const t2 = t *t;
        const t3 = t2*t;
        const t4 = t3*t;

        const W1  = 218 * 3600 + 18 * 60 + 59.95571 + 1732559343.73604 * t - 5.8883 * t2 + 0.006604 * t3 - 0.00003169 * t4;
        const dW1 = 1732559343.73604 - 5.8883 * 2 * t + 0.006604 * 3 * t2 - 0.00003169 * 4 * t3;

        for (let i = 0; i < 12; ++i) {
            const f1 = this._calcFile(i * 3    , t, t2, t3, t4);
            const f2 = this._calcFile(i * 3 + 1, t, t2, t3, t4);
            const f3 = this._calcFile(i * 3 + 2, t, t2, t3, t4);
            lon  += f1[0];
            dlon += f1[1];
            lat  += f2[0];
            dlat += f2[1];
            r    += f3[0];
            dr   += f3[1];
        }

        return {
            'lon':  deg2rad(( lon +  W1) / 3600),
            'dlon': deg2rad((dlon + dW1) / 3600),
            'lat':  deg2rad( lat / 3600),
            'dlat': deg2rad(dlat / 3600),
            'r':    r,
            'dr':   dr
        }
	}
}