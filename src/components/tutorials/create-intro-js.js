import introJs from "intro.js";

export function createIntroJs({ steps }) {
    const intro = introJs();
    intro.setOptions({
        steps,
        hideNext: true,
        hidePrev: true,
        showBullets: false,
        showProgress: true,
        showStepNumbers: false,
        scrollToElement: true,
        tooltipClass: "urbain-tutorial-wizard",
        exitOnOverlayClick: false,
        disableInteraction: true,
        doneLabel: "OK, got it",
    });

    return intro;
}
