/**
 * @param {Date} date
 * @param scaleType
 * @return {string|*}
 */
export default function formatDate(date, scaleType) {
    if (
        scaleType === "minute" ||
        scaleType === "fiveMinutes" ||
        scaleType === "tenMinutes" ||
        scaleType === "thirtyMinutes" ||
        scaleType === "hour" ||
        scaleType === "threeHours" ||
        scaleType === "sixHours"
    ) {
        let string = date.getYear() + 1900;
        string += "-" + (date.getMonth() + 1 + "").padStart(2, "0");
        string += "-" + (date.getDate() + "").padStart(2, "0");
        string += " " + (date.getHours() + "").padStart(2, "0");
        string += ":" + (date.getMinutes() + "").padStart(2, "0");
        return string;
    } else if (scaleType === "day" || scaleType === "week") {
        let string = date.getYear() + 1900;
        string += "-" + (date.getMonth() + 1 + "").padStart(2, "0");
        string += "-" + (date.getDate() + "").padStart(2, "0");
        return string;
    } else if (scaleType === "month" || scaleType === "threeMonths") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[date.getMonth()] + " " + (date.getYear() + 1900);
    } else if (scaleType === "year" || scaleType === "fiveYears") {
        return date.getYear() + 1900 + "";
    }
    return date.toString();
}
