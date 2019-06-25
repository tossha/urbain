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
        scaleType === "threeHours"
    ) {
        let string = "" + (Math.floor(date / 9201600) + 1) + "y";
        string += " " + ("" + (Math.floor((date % 9201600) / 21600) + 1)).padStart(3, "0") + "d";
        string += " " + ("" + Math.floor((date % 21600) / 3600)).padStart(2, "0");
        string += ":" + ("" + Math.floor((date % 3600) / 60)).padStart(2, "0");
        return string;
    } else if (
        scaleType === "day" ||
        scaleType === "threeDays" ||
        scaleType === "tenDays" ||
        scaleType === "thirtyDays" ||
        scaleType === "hundredDays"
    ) {
        let string = "" + (Math.floor(date / 9201600) + 1) + "y";
        string += " " + ("" + (Math.floor((date % 9201600) / 21600) + 1)).padStart(3, "0") + "d";
        return string;
    } else if (scaleType === "year" || scaleType === "fiveYears" || scaleType === "twentyYears") {
        return "" + (Math.floor(date / 9201600) + 1) + "y";
    }
    return null;
}
