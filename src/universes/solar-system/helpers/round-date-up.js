/**
 * @param {Date} date
 * @param scaleType
 * @return {*}
 */
export default function roundDateUp(date, scaleType) {
    const d = new Date(date);
    if (scaleType === "minute") {
        d.setSeconds(60, 0);
    } else if (scaleType === "fiveMinutes") {
        d.setMinutes(5 + d.getMinutes() - (d.getMinutes() % 5), 0, 0);
    } else if (scaleType === "tenMinutes") {
        d.setMinutes(10 + d.getMinutes() - (d.getMinutes() % 10), 0, 0);
    } else if (scaleType === "thirtyMinutes") {
        d.setMinutes(30 + d.getMinutes() - (d.getMinutes() % 30), 0, 0);
    } else if (scaleType === "hour") {
        d.setMinutes(60, 0, 0);
    } else if (scaleType === "threeHours") {
        d.setHours(3 + d.getHours() - (d.getHours() % 3), 0, 0, 0);
    } else if (scaleType === "sixHours") {
        d.setHours(6 + d.getHours() - (d.getHours() % 6), 0, 0, 0);
    } else if (scaleType === "day") {
        d.setHours(24, 0, 0, 0);
    } else if (scaleType === "week") {
        d.setHours(0, 0, 0, 0);
        d.setDate(7 + d.getDate() - d.getDay());
    } else if (scaleType === "month") {
        d.setHours(0, 0, 0, 0);
        d.setDate(1);
        d.setMonth(d.getMonth() + 1);
    } else if (scaleType === "threeMonths") {
        d.setHours(0, 0, 0, 0);
        d.setDate(1);
        d.setMonth(3 + d.getMonth() - (d.getMonth() % 3));
    } else if (scaleType === "year") {
        d.setHours(0, 0, 0, 0);
        d.setMonth(0, 1);
    } else if (scaleType === "fiveYears") {
        d.setHours(0, 0, 0, 0);
        d.setFullYear(5 + d.getFullYear() - (d.getFullYear() % 5), 0, 1);
    } else {
        return;
    }
    return d;
}
