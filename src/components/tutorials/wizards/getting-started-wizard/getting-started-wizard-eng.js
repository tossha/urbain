import { GETTING_STARTED_WIZARD, getEng } from "../wizard-ids";

const gettingStartedWizardRu = {
    wizardId: getEng(GETTING_STARTED_WIZARD),
    steps: [
        {
            intro: "<b>Mouse wheel</b>: scale<br><b>Right button</b>: drag<br><b>Left button</b>: set time",
            element: ".time-line",
            position: "top",
        },
        {
            intro: `
                <div class="urbain-tutorial-wizard__content--wide">
                     Camera control<br>
                     <br>
                     <b>Mouse wheel</b>: close in/move away<br>
                     <b>Mouse wheel hovering over planet</b>: switch camera<br>
                     <b>Holding Shift</b>: sensitive mode<br>
                </div>
            `,
            position: "auto",
        },
        {
            intro: "Control time scale or return to current moment",
            element: ".time-settings-panel",
            position: "top",
        },

        {
            intro: "Switch reference frames of the camera",
            element: ".camera-panel",
            position: "top",
        },
    ],
};

export default gettingStartedWizardRu;
