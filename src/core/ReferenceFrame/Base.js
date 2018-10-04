import ReferenceFrameAbstract from "./Abstract";
import {RF_BASE} from "./Factory";

export default class ReferenceFrameBase extends ReferenceFrameAbstract
{
    constructor() {
        super();
        this.id = RF_BASE;
    }
}