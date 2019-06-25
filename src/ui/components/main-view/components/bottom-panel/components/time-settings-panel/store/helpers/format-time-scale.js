import {
    ONE_HOUR_IN_SECONDS,
    ONE_MINUTE_IN_SECONDS,
    TWENTY_FOUR_HOURS_IN_SECONDS,
} from "../../../../../../../../../constants/dates";

export function formatTimeScale(scale) {
    const precision = 2;
    const prefix = scale < 0 ? "-" : "";
    const abs = Math.abs(scale);

    if (abs === 0) {
        return "0";
    }

    if (abs < ONE_MINUTE_IN_SECONDS) {
        return prefix + abs.toPrecision(precision) + " s/s";
    }

    if (abs < ONE_HOUR_IN_SECONDS) {
        return prefix + (abs / ONE_MINUTE_IN_SECONDS).toPrecision(precision) + " min/s";
    }

    if (abs < TWENTY_FOUR_HOURS_IN_SECONDS) {
        return prefix + (abs / ONE_HOUR_IN_SECONDS).toPrecision(precision) + " h/s";
    }

    if (abs < 2592000) {
        return prefix + (abs / TWENTY_FOUR_HOURS_IN_SECONDS).toPrecision(precision) + " days/s";
    }

    if (abs < 31557600) {
        return prefix + (abs / 2592000).toPrecision(precision) + " months/s";
    }

    return prefix + (abs / 31557600).toPrecision(precision) + " years/s";
}
