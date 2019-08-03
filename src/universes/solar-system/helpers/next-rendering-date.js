/**
 * @param {Date} date
 * @param scaleType
 * @return {*}
 */
export default function nextRenderingDate(date, scaleType) {
    const d = new Date(date);
    if (scaleType === "minute") {
        d.setMinutes(d.getMinutes() + 1);
    } else if (scaleType === "fiveMinutes") {
        d.setMinutes(d.getMinutes() + 5);
    } else if (scaleType === "tenMinutes") {
        d.setMinutes(d.getMinutes() + 10);
    } else if (scaleType === "thirtyMinutes") {
        d.setMinutes(d.getMinutes() + 30);
    } else if (scaleType === "hour") {
        d.setHours(d.getHours() + 1);
    } else if (scaleType === "threeHours") {
        d.setHours(d.getHours() + 3);
    } else if (scaleType === "sixHours") {
        d.setHours(d.getHours() + 6);
    } else if (scaleType === "day") {
        d.setDate(d.getDate() + 1);
    } else if (scaleType === "week") {
        d.setDate(d.getDate() + 7);
    } else if (scaleType === "month") {
        d.setMonth(d.getMonth() + 1);
    } else if (scaleType === "threeMonths") {
        d.setMonth(d.getMonth() + 3);
    } else if (scaleType === "year") {
        d.setFullYear(d.getFullYear() + 1, d.getMonth(), d.getDate());
    } else if (scaleType === "fiveYears") {
        d.setFullYear(d.getFullYear() + 5, d.getMonth(), d.getDate());
    } else {
        return;
    }
    return d;
}
