class TrajectoryKeplerianArray extends TrajectoryKeplerianAbstract
{
    constructor(referenceFrameId, color) {
        super(referenceFrameId, color);

        this.keplerianObjects = []; // array of class KeplerianObject
        this.color = color;
    }

    addState(keplerianObject) {
        this.keplerianObjects.push(keplerianObject);

        if ((this.minEpoch === null)
            || (keplerianObject.epoch < this.minEpoch)
        ) {
            this.minEpoch = keplerianObject.epoch;
        }

        if ((this.maxEpoch === null)
            || (keplerianObject.epoch > this.maxEpoch)
        ) {
            this.maxEpoch = keplerianObject.epoch;
        }
    }

    getKeplerianObjectByEpoch(epoch) {
        if ((this.minEpoch === null)
            || (this.maxEpoch === null)
        ) {
            return null;
        }

        if (epoch <= this.minEpoch) {
            return this.keplerianObjects[0];
        }
        if (epoch >= this.maxEpoch) {
            return this.keplerianObjects[this.keplerianObjects.length - 1];
        }

        let nextIdx = Math.ceil((epoch - this.minEpoch) / (this.maxEpoch - this.minEpoch) * (this.keplerianObjects.length - 1));
        let searchDirection = this.keplerianObjects[nextIdx].epoch > epoch ? -1 : 1;

        while ((nextIdx < this.keplerianObjects.length) && (nextIdx > 0)) {
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
        return new KeplerianObject(
            approximateNumber(object1.e, object2.e, proportion),
            approximateNumber(object1.sma, object2.sma, proportion),
            approximateAngle(object1.aop, object2.aop, proportion),
            approximateAngle(object1.inc, object2.inc, proportion),
            approximateAngle(object1.raan, object2.raan, proportion),
            approximateAngle(object1.getMeanAnomalyByEpoch(epoch), object2.getMeanAnomalyByEpoch(epoch), proportion),
            epoch,
            approximateNumber(object1.mu, object2.mu, proportion),
            false
        );
    }
}