import * as wizardIds from "../wizard-ids";

const qettingStartedWizard = {
    langs: [
        {
            id: wizardIds.getRus(wizardIds.GETTING_STARTED_WIZARD),
            description: "Приветствие на русском языке!",
            buttonLabel: "Далее",
        },
        {
            id: wizardIds.getEng(wizardIds.GETTING_STARTED_WIZARD),
            description: "Greetings in English!",
            buttonLabel: "Next",
        },
    ],
};

export default qettingStartedWizard;
