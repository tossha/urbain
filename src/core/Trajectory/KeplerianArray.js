import TrajectoryKeplerianAbstract from "./KeplerianAbstract";
import {approximateAngle, approximateNumber} from "../../algebra";
import KeplerianObject from "../KeplerianObject";
import StateVector from "../StateVector";
import {Vector} from "../../algebra";

export default class TrajectoryKeplerianArray extends TrajectoryKeplerianAbstract
{
    constructor(referenceFrameId) {
        super(referenceFrameId);
        this.keplerianObjects = []; // array of class KeplerianObject
    }

    addState(keplerianObject) {
        this.keplerianObjects.push(keplerianObject);
    }

    getKeplerianObjectByEpoch(epoch) {
        if ((this.minEpoch === null) || (epoch <= this.minEpoch)) {
            return this.keplerianObjects[0];
        }
        if ((this.maxEpoch === null) || (epoch >= this.maxEpoch)) {
            return this.keplerianObjects[this.keplerianObjects.length - 1];
        }

        let nextIdx = Math.ceil((epoch - this.minEpoch) / (this.maxEpoch - this.minEpoch) * (this.keplerianObjects.length - 1));
        let searchDirection = this.keplerianObjects[nextIdx].epoch > epoch ? -1 : 1;

        while ((nextIdx < this.keplerianObjects.length) && (nextIdx > 0)) {
            if (this.keplerianObjects[nextIdx].epoch == epoch) {
                return this.keplerianObjects[nextIdx];
            }
            if ((this.keplerianObjects[nextIdx].epoch > epoch)
                && (this.keplerianObjects[nextIdx - 1].epoch < epoch)
            ) {
                break;
            }
            nextIdx += searchDirection;
        }

        if ((nextIdx === this.keplerianObjects.length) || (nextIdx === 0)) {
            nextIdx -= searchDirection;
        }

        return this.approximateKeplerianObject(
            this.keplerianObjects[nextIdx - 1],
            this.keplerianObjects[nextIdx],
            epoch
        );
    }

    approximateKeplerianObject(object1, object2, epoch) {
        const proportion = (epoch - object1.epoch) / (object2.epoch - object1.epoch);

        if ((0.95 < object1.e && object1.e < 1.05)
            || (0.95 < object2.e && object2.e < 1.05)
            || (object1.isElliptic !== object2.isElliptic)
        ) {
            const state1 = object1.getStateByEpoch(epoch);
            const state2 = object2.getStateByEpoch(epoch);
            return KeplerianObject.createFromState(
                new StateVector(
                    state1.position.mul_(1 - proportion).add_(state2.position.mul_(proportion)),
                    state1.velocity.mul_(1 - proportion).add_(state2.velocity.mul_(proportion)),
                ),
                approximateNumber(object1.mu, object2.mu, proportion),
                epoch
            );
        }

        const ma = object1.isElliptic
            ? approximateAngle(object1.getMeanAnomalyByEpoch(epoch), object2.getMeanAnomalyByEpoch(epoch), proportion)
            : approximateNumber(object1.getMeanAnomalyByEpoch(epoch), object2.getMeanAnomalyByEpoch(epoch), proportion);

        return new KeplerianObject(
            approximateNumber(object1.e, object2.e, proportion),
            approximateNumber(object1.sma, object2.sma, proportion),
            approximateAngle(object1.aop, object2.aop, proportion),
            approximateAngle(object1.inc, object2.inc, proportion),
            approximateAngle(object1.raan, object2.raan, proportion),
            ma,
            epoch,
            approximateNumber(object1.mu, object2.mu, proportion),
            false
        );
    }
}