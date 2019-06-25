import { timeScales } from "../constants";

/**
 * @param {Date} date
 * @param scaleType
 * @return {*}
 */
export default function nextRenderingDate(epoch, scaleType) {
    return epoch + timeScales[scaleType];
}
