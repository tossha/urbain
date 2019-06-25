/**
 * @param {Date} date
 * @return {string}
 */
export default function formatDateFull(date) {
    let string = date.getYear() + 1900;
    string += "-" + (date.getMonth() + 1 + "").padStart(2, "0");
    string += "-" + (date.getDate() + "").padStart(2, "0");
    string += " " + (date.getHours() + "").padStart(2, "0");
    string += ":" + (date.getMinutes() + "").padStart(2, "0");
    string += ":" + (date.getSeconds() + "").padStart(2, "0");
    return string;
}
