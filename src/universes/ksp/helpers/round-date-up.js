import { timeScales } from "../constants";
/**
 * @param {Date} date
 * @param scaleType
 * @return {*}
 */
export default function roundDateUp(epoch, scaleType) {
    return Math.ceil(epoch / timeScales[scaleType]) * timeScales[scaleType];
}
