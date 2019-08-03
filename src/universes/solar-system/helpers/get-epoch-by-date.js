import { J2000_TIMESTAMP } from "../../../constants/timestamps";

/**
 * @param {Date} date
 * @return {number}
 */
export default function getEpochByDate(date) {
    return date / 1000 - J2000_TIMESTAMP;
}
