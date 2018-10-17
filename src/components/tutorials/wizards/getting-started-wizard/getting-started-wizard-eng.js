import { GETTING_STARTED_WIZARD, getEng } from "../wizard-ids";

const gettingStartedWizardRu = {
    wizardId: getEng(GETTING_STARTED_WIZARD),
    steps: [
        {
            intro: "This is our cool Time line",
            element: ".time-line",
            position: "top",
        },
        {
            intro: `
                <div class="urbain-tutorial-wizard__content--wide">
                     The explanation how to control the camera view<br><br>                 
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                     Pellentesque posuere finibus purus, sit amet malesuada turpis 
                     tristique non. Aliquam gravida enim ac sollicitudin lacinia. 
                     Nulla elementum semper finibus. Vivamus ut laoreet turpis. 
                     Ut tristique nulla sed augue accumsan dignissim. Pellentesque quam nisl, bibendum id, 
                     interdum quis neque. Donec quis ullamcorper erat. 
                     Fusce dictum gravida dui. Nunc sodales ipsum nec posuere ultrices.
                </div>
                 
            `,
            position: "auto",
        },
        {
            intro: "This is Time Settings panel",
            element: ".time-settings-panel",
            position: "top",
        },

        {
            intro: "This is Camera panel",
            element: ".camera-panel",
            position: "top",
        },
    ],
};

export default gettingStartedWizardRu;
