/**
 * @param {Date} date
 * @return {string}
 */
export default function formatDateFull(date) {
    let string = "" + (Math.floor(date / 9201600) + 1) + "y";
    string += " " + ("" + (Math.floor((date % 9201600) / 21600) + 1)).padStart(3, "0") + "d";
    string += " " + ("" + Math.floor((date % 21600) / 3600)).padStart(2, "0");
    string += ":" + ("" + Math.floor((date % 3600) / 60)).padStart(2, "0");
    string += ":" + ("" + Math.round(date % 60)).padStart(2, "0");
    return string;
}
