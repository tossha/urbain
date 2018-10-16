import * as wizardIds from "./wizards/wizard-ids";
import LocalStorageWatchStatusService from "./services/local-storage-watch-status-service";
import { showDialog } from "./language-selector";

async function showWizard(wizardId, watchStatusService = new LocalStorageWatchStatusService(window.localStorage)) {
    if (!watchStatusService.canWatch(wizardId)) {
        return;
    }

    const selectedId = await showDialog(wizardIds.getRus(wizardId), wizardIds.getEng(wizardId));

    Promise.all([
        import(/* webpackChunkName: "[request]" */ `./wizards/${selectedId}`),
        import(/* webpackChunkName: "createIntroJs" */ `./create-intro-js`),
        import(/* webpackChunkName: "introjsStyles" */ "./introjs.scss"),
    ]).then(([{ default: wizardConfig }, { createIntroJs }]) => {
        const intro = createIntroJs(wizardConfig);
        intro.start();
    });
}

export { showWizard, wizardIds };
