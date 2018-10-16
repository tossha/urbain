import { GETTING_STARTED_WIZARD_ENG } from "./wizard-ids";

const gettingStartedWizardRu = {
    wizardId: GETTING_STARTED_WIZARD_ENG,
    steps: [
        {
            intro: `
                <div class="urbain-tutorial-wizard__content--wide">
                     Urbain: traversing the Solar System <br>
                     <br> 
                     And very looooong text below<br> 
                     <br>                 
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
            intro: `
                <iframe 
                    width="560" height="315" 
                    src="https://www.youtube.com/embed/2K5YZQVtFnY" 
                    frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>                    
                </iframe>
            `,

            position: "top",
        },
        {
            intro: "This is Time Settings panel",
            element: ".time-settings-panel",
            position: "top",
        },
        {
            intro: "This is Time line",
            element: ".time-line",
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
