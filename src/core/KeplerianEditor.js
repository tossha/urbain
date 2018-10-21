import FunctionOfEpochCustom from "./FunctionOfEpoch/Custom";
import {Quaternion, Vector} from "./algebra";
import VisualAngle from "./visual/Angle";
import Constant from "./FunctionOfEpoch/Constant";
import VisualPlanePoint from "./visual/PlanePoint";
import { sim } from "./Simulation";

export default class KeplerianEditor
{
    constructor(trajectory) {
        this.isEditMode = trajectory.isEditable;
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
        let position = new Constant(new Vector(3));

        this.angleRaan = new VisualAngle(
            referenceFrame,
            position,
            new Constant(new Quaternion()),
            new FunctionOfEpochCustom(epoch => this.trajectory.getKeplerianObjectByEpoch(epoch).raan),
            this.colorRaan,
            1.5,
            this.isEditMode ? VisualAngle.TYPE_SECTOR : VisualAngle.TYPE_ARC,
            this.isEditMode ? value => { this.trajectory.raan = value; } : null
        );
        this.angleRaan.customPriority = 4;

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
            this.isEditMode ? value => { this.trajectory.inc = value; } : null
        );
        this.angleInc.setBounds(0, Math.PI);
        this.angleInc.customPriority = 3;

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
            2.5,
            this.isEditMode ? VisualAngle.TYPE_SECTOR : VisualAngle.TYPE_ARC,
            this.isEditMode ? value => { this.trajectory.aop = value; } : null
        );
        this.angleAop.customPriority = 2;

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
            3,
            VisualAngle.TYPE_ARC
        );

        if (this.isEditMode) {
            this.pointApoapsis = new VisualPlanePoint(
                new Constant(this.trajectory.pericentricReferenceFrame),
                new Vector([-this.trajectory.sma * (1 + this.trajectory.ecc), 0, 0]),
                'red',
                8,
                value => {
                    const periapsis = this.trajectory.sma * (1 - this.trajectory.ecc);
                    const sma = (-value.x + periapsis) / 2;
                    this.trajectory.sma = sma;
                    this.trajectory.ecc = 1 - periapsis / sma;
                },
                () => [false, 0, 0],
                () => [-this.trajectory.sma * (1 - this.trajectory.ecc), 0, 0]
            );
            this.pointPeriapsis = new VisualPlanePoint(
                new Constant(this.trajectory.pericentricReferenceFrame),
                new Vector([this.trajectory.sma * (1 - this.trajectory.ecc), 0, 0]),
                'blue',
                8,
                value => {
                    const apoapsis = this.trajectory.sma * (1 + this.trajectory.ecc);
                    const sma = (value.x + apoapsis) / 2;
                    this.trajectory.sma = sma;
                    this.trajectory.ecc = apoapsis / sma - 1;
                },
                () => [0, 0, 0],
                () => [this.trajectory.sma * (1 + this.trajectory.ecc), 0, 0]
            );
            this.angleTaEditing = new VisualAngle(
                referenceFrame,
                position,
                new FunctionOfEpochCustom((epoch) => (new Quaternion(new Vector([0,0,1]), this.trajectory.raan))
                        .mul_(new Quaternion(new Vector([1,0,0]), this.trajectory.inc))
                        .mul_(new Quaternion(new Vector([0,0,1]), this.trajectory.aop))),
                new Constant(this.trajectory.ta),
                this.colorTa,
                3,
                VisualAngle.TYPE_SECTOR,
                value => { this.trajectory.ta = value; }
            );
            this.angleTaEditing.customPriority = 1;

        }
    }

    remove() {
        this.angleRaan && this.angleRaan.drop();
        this.angleAop && this.angleAop.drop();
        this.angleInc && this.angleInc.drop();
        this.angleTa && this.angleTa.drop();
        this.angleTaEditing && this.angleTaEditing.drop();

        this.pointApoapsis && this.pointApoapsis.drop();
        this.pointPeriapsis && this.pointPeriapsis.drop();
    }
}
