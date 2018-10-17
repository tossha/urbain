import * as wizardIds from "../wizard-ids";

const qettingStartedWizard = {
    langs: [
        {
            id: wizardIds.getRus(wizardIds.GETTING_STARTED_WIZARD),
            description: "Urbain — точная модель Солнечной системы. Доступно более 40 000 спутников, прокладывание собственных траекторий и многое другое!",
            buttonLabel: "Далее",
        },
        {
            id: wizardIds.getEng(wizardIds.GETTING_STARTED_WIZARD),
            description: "Urbain is a model of our Solar System. You can view more than 40 000 satellites, create your own trajectories and much more!",
            buttonLabel: "Next",
        },
    ],
};

export default qettingStartedWizard;
