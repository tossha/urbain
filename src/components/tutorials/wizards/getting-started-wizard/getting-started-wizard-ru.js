import { getRus, GETTING_STARTED_WIZARD } from "../wizard-ids";

const gettingStartedWizardRu = {
    wizardId: getRus(GETTING_STARTED_WIZARD),
    nextLabel: "Далее",
    prevLabel: "Назад",
    doneLabel: "Готово",
    steps: [
        {
            intro: "<b>Колёсико мыши</b>: маштаб<br><b>Правая кнопка</b>: перетаскивание<br><b>Левая кнопка</b>: выбор времени",
            element: ".time-line",
            position: "top",
        },
        {
            intro: `
                <div class="urbain-tutorial-wizard__content--wide">
                     Управление камерой<br>
                     <br>
                     <b>Колёсико мыши</b>: приближение/отдаление<br>
                     <b>Колёсико с наведением на планету</b>: переключить камеру<br>
                     <b>Зажатый Shift</b>: чувствительный режим<br>
                </div>
            `,
            position: "auto",
        },
        {
            intro: "Управляйте скоростью времени или вернитесь к настоящему моменту",
            element: ".time-settings-panel",
            position: "top",
        },

        {
            intro: "Переключайте системы отсчёта для камеры",
            element: ".camera-panel",
            position: "top",
        },
    ],
};

export default gettingStartedWizardRu;
