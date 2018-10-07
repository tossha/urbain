import Module from "../../core/Module";
import { sim } from "../../core/Simulation";

export default class ModuleKSP extends Module
{
    static timeScales = {
        minute: 60,
        fiveMinutes: 300,
        tenMinutes: 600,
        thirtyMinutes: 1800,
        hour: 3600,
        threeHours: 10800,
        day: 21600,
        threeDays: 64800,
        tenDays: 216000,
        thirtyDays: 648000,
        hundredDays: 2160000,
        year: 9201600,
        fiveYears: 46008000,
        twentyYears: 184032000,
    };

    loadStarSystem() {
        sim.loadStarSystem('ksp.json', () => {
            sim.forceEpoch(0);
            sim.time.scales = ModuleKSP.timeScales;
            sim.time.updateScaleType();

            sim.time.getDateByEpoch = ModuleKSP.getDateByEpoch;
            sim.time.getEpochByDate = ModuleKSP.getEpochByDate;
            sim.time.roundDateUp = ModuleKSP.roundDateUp;
            sim.time.nextRenderingDate = ModuleKSP.nextRenderingDate;
            sim.time.formatDate = ModuleKSP.formatDate;
            sim.time.formatDateFull = ModuleKSP.formatDateFull;

            sim.ui.lambertPanel.useCurrentTime();
        });
    }

    static getDateByEpoch(epoch) {
        return epoch;
    }

    static getEpochByDate(date) {
        return date;
    }

    static roundDateUp(epoch, scaleType) {
        return Math.ceil(epoch / ModuleKSP.timeScales[scaleType]) * ModuleKSP.timeScales[scaleType];
    }

    static nextRenderingDate(epoch, scaleType) {
        return epoch + ModuleKSP.timeScales[scaleType];
    }

    static formatDate(date, scaleType) {
        if ((scaleType === "minute")
            || (scaleType === "fiveMinutes")
            || (scaleType === "tenMinutes")
            || (scaleType === "thirtyMinutes")
            || (scaleType === "hour")
            || (scaleType === "threeHours")
        ) {
            let string = '' + Math.floor(date / 9201600) + 'y';
            string += ' ' + ('' + Math.floor((date % 9201600) / 21600)).padStart(3, '0') + 'd';
            string += ' ' + ('' + Math.floor((date % 21600) / 3600)).padStart(2, '0');
            string += ':' + ('' + Math.floor((date % 3600) / 60)).padStart(2, '0');
            return string;
        } else if ((scaleType === "day")
            || (scaleType === "threeDays")
            || (scaleType === "tenDays")
            || (scaleType === "thirtyDays")
            || (scaleType === "hundredDays")
        ) {
            let string = '' + Math.floor(date / 9201600) + 'y';
            string += ' ' + ('' + Math.floor((date % 9201600) / 21600)).padStart(3, '0') + 'd';
            return string;
        } else if ((scaleType === "year")
            || (scaleType === "fiveYears")
            || (scaleType === "twentyYears")
        ) {
            return '' + Math.floor(date / 9201600) + 'y';
        }
        return null;
    }

    static formatDateFull(date) {
        let string = '' + Math.floor(date / 9201600) + 'y';
        string += ' ' + ('' + Math.floor((date % 9201600) / 21600)).padStart(3, '0') + 'd';
        string += ' ' + ('' + Math.floor((date % 21600) / 3600)).padStart(2, '0');
        string += ':' + ('' + Math.floor((date % 3600) / 60)).padStart(2, '0');
        string += ':' + ('' + Math.round(date % 60)).padStart(2, '0');
        return string;
    }
}
