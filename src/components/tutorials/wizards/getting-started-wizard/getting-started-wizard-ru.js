import { getRus, GETTING_STARTED_WIZARD } from "../wizard-ids";

const gettingStartedWizardRu = {
    wizardId: getRus(GETTING_STARTED_WIZARD),
    nextLabel: "Далее",
    prevLabel: "Назад",
    doneLabel: "Готово",
    steps: [
        {
            intro: "Это панель управления временем",
            element: ".time-line",
            position: "top",
        },
        {
            intro: `
                <div class="urbain-tutorial-wizard__content--wide">
                     Описание управления камерой и углами обзора<br>
                     <br>                 
                     Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. 
                     Что возвращайся себя над там маленький lorem власти злых от всех, своего, несколько ему эта
                     мир все, послушавшись свою парадигматическая! Возвращайся!
                </div>
                 
            `,
            position: "auto",
        },
        {
            intro: "Панель настроек скрости изменения времени",
            element: ".time-settings-panel",
            position: "top",
        },

        {
            intro: "Панель настройки вида",
            element: ".camera-panel",
            position: "top",
        },
    ],
};

export default gettingStartedWizardRu;
