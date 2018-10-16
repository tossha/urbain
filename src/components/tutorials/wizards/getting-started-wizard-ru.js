import { GETTING_STARTED_WIZARD_RU } from "./wizard-ids";

const gettingStartedWizardRu = {
    wizardId: GETTING_STARTED_WIZARD_RU,
    nextLabel: "Далее",
    prevLabel: "Назад",
    steps: [
        {
            intro: `
                <div class="urbain-tutorial-wizard__content--wide">
                     Urbain: Описание на русском языке<br>                      
                     <br>                 
                     Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Что возвращайся себя над там маленький lorem власти злых от всех, своего, несколько ему эта мир все, послушавшись свою парадигматическая! Возвращайся!
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
