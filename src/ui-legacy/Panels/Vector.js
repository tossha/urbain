
import UIPanel from "../Panel";
import {presentNumberWithSuffix, Vector} from "../../core/algebra";
import FunctionOfEpochAbstract from "../../core/FunctionOfEpoch/Abstract";

export default class UIPanelVector extends UIPanel
{
    constructor(panelDom, vectorOfEpoch) {
        super(panelDom, true);
        this.vectorOfEpoch = vectorOfEpoch;
        this.jqMag = this.jqDom.find('.vec-magnitude');
        this.jqX = this.jqDom.find('.vec-x');
        this.jqY = this.jqDom.find('.vec-y');
        this.jqZ = this.jqDom.find('.vec-z');
    }

    set(vector, epoch) {
        this.vectorOfEpoch = vector;
        this.update(epoch);
    }

    update(epoch) {
        let vector = this.vectorOfEpoch;
        if ((epoch || epoch === 0)
            && (vector instanceof FunctionOfEpochAbstract)
        ) {
            vector = vector.evaluate(epoch);
        }

        if (!vector instanceof Vector) {
            return;
        }

        this.jqMag.html(presentNumberWithSuffix(vector.mag));
        this.jqX.html  (presentNumberWithSuffix(vector.x));
        this.jqY.html  (presentNumberWithSuffix(vector.y));
        this.jqZ.html  (presentNumberWithSuffix(vector.z));
    }
}
