import { J2000_TIMESTAMP } from "../../../constants/timestamps";

/**
 * @param {number} epoch
 * @return {Date}
 */
export default function getDateByEpoch(epoch) {
    return new Date((J2000_TIMESTAMP + epoch) * 1000);
}
