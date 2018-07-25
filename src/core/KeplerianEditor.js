import FunctionOfEpochCustom from "./FunctionOfEpoch/Custom";
import {Quaternion, Vector} from "./algebra";
import VisualAngle from "../visual/Angle";
import { sim } from "./Simulation";

export default class KeplerianEditor
{
    constructor(trajectory, isEditMode) {
        this.isEditMode = isEditMode && (trajectory.keplerianObject !== undefined);
        this.trajectory = trajectory;

        this.colorRaan = 0x7FFFD4; //lightblue
        this.colorAop  = 0x9966CC; //violet
        this.colorInc  = 0xB00000; //red
        this.colorTa   = 0xFC0FC0; //pink

        if (sim.settings.ui.showAnglesOfSelectedOrbit) {
            this.init();
        }
    }

    init() {
        let referenceFrame = new FunctionOfEpochCustom(epoch => this.trajectory.getReferenceFrameByEpoch(epoch));
        let position = new Vector(3);

        this.angleRaan = new VisualAngle(
            referenceFrame,
            position,
            new Quaternion(),
            new FunctionOfEpochCustom(epoch => this.trajectory.getKeplerianObjectByEpoch(epoch).raan),
            this.colorRaan,
            1,
            this.isEditMode ? VisualAngle.TYPE_SECTOR : VisualAngle.TYPE_ARC,
            this.isEditMode ? value => { this.trajectory.keplerianObject.raan = value; } : null
        );

        this.angleInc = new VisualAngle(
            referenceFrame,
            position,
            new FunctionOfEpochCustom(epoch => {
                const ko = this.trajectory.getKeplerianObjectByEpoch(epoch);
                return (new Quaternion(new Vector([0,0,1]), ko.raan + Math.PI / 2))
                    .mul_(new Quaternion(new Vector([1,0,0]), Math.PI / 2));
            }),
            new FunctionOfEpochCustom(epoch => this.trajectory.getKeplerianObjectByEpoch(epoch).inc),
            this.colorInc,
            2,
            this.isEditMode ? VisualAngle.TYPE_SECTOR : VisualAngle.TYPE_ARC,
            this.isEditMode ? value => { this.trajectory.keplerianObject.inc = value; } : null
        );

        this.angleAop = new VisualAngle(
            referenceFrame,
            position,
            new FunctionOfEpochCustom(epoch => {
                const ko = this.trajectory.getKeplerianObjectByEpoch(epoch);
                return (new Quaternion(new Vector([0,0,1]), ko.raan))
                    .mul_(new Quaternion(new Vector([1,0,0]), ko.inc));
            }),
            new FunctionOfEpochCustom(epoch => this.trajectory.getKeplerianObjectByEpoch(epoch).aop),
            this.colorAop,
            3,
            this.isEditMode ? VisualAngle.TYPE_SECTOR : VisualAngle.TYPE_ARC,
            this.isEditMode ? value => { this.trajectory.keplerianObject.aop = value; } : null
        );

        this.angleTa = new VisualAngle(
            referenceFrame,
            position,
            new FunctionOfEpochCustom(epoch => {
                const ko = this.trajectory.getKeplerianObjectByEpoch(epoch);
                return (new Quaternion(new Vector([0,0,1]), ko.raan))
                    .mul_(new Quaternion(new Vector([1,0,0]), ko.inc))
                    .mul_(new Quaternion(new Vector([0,0,1]), ko.aop));
            }),
            new FunctionOfEpochCustom(epoch => this.trajectory.getKeplerianObjectByEpoch(epoch).getTrueAnomalyByEpoch(epoch)),
            this.colorTa,
            4,
            VisualAngle.TYPE_ARC
        );
    }

    remove() {
        if (this.angleRaan) this.angleRaan.drop();
        if (this.angleAop)  this.angleAop.drop();
        if (this.angleInc)  this.angleInc.drop();
        if (this.angleTa)   this.angleTa.drop();
    }
}
