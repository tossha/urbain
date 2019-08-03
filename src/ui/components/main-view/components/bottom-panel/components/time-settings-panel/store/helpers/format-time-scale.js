import {
    SECONDS_PER_HOUR,
    SECONDS_PER_MINUTE,
    SECONDS_PER_DAY,
    SECONDS_PER_MONTH,
    SECONDS_PER_YEAR,
} from "../../../../../../../../../constants/dates";

export function formatTimeScale(scale) {
    const precision = 2;
    const prefix = scale < 0 ? "-" : "";
    const abs = Math.abs(scale);

    if (abs === 0) {
        return "0";
    }

    if (abs < SECONDS_PER_MINUTE) {
        return prefix + abs.toPrecision(precision) + " s/s";
    }

    if (abs < SECONDS_PER_HOUR) {
        return prefix + (abs / SECONDS_PER_MINUTE).toPrecision(precision) + " min/s";
    }

    if (abs < SECONDS_PER_DAY) {
        return prefix + (abs / SECONDS_PER_HOUR).toPrecision(precision) + " h/s";
    }

    if (abs < SECONDS_PER_MONTH) {
        return prefix + (abs / SECONDS_PER_DAY).toPrecision(precision) + " days/s";
    }

    if (abs < SECONDS_PER_YEAR) {
        return prefix + (abs / SECONDS_PER_MONTH).toPrecision(precision) + " months/s";
    }

    return prefix + (abs / SECONDS_PER_YEAR).toPrecision(precision) + " years/s";
}
