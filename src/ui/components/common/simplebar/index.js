import SimpleBar from "simplebar";
import "./index.scss";

export function createSimplebar(node, options) {
    return new SimpleBar(node, {
        autoHide: false,

        ...options,
    });
}
