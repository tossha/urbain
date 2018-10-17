import * as wizardIds from "./wizards/wizard-ids";
import LocalStorageWatchStatusService from "./services/local-storage-watch-status-service";
import { showLangSelectorDialog } from "./language-selector";

async function showWizard(wizardId, watchStatusService = new LocalStorageWatchStatusService(window.localStorage)) {
    if (!watchStatusService.canWatch(wizardId)) {
        return;
    }

    const { default: wizard } = await import(/* webpackChunkName: "[request]" */ `./wizards/${wizardId}/index`);
    const selectedId = await showLangSelectorDialog(wizard.langs);

    Promise.all([
        import(/* webpackChunkName: "[request]" */ `./wizards/${wizardId}/${selectedId}`),
        import(/* webpackChunkName: "createIntroJs" */ `./create-intro-js`),
        import(/* webpackChunkName: "introjsStyles" */ "./introjs.scss"),
    ])
        .then(([{ default: wizardConfig }, { createIntroJs }]) => {
            const intro = createIntroJs(wizardConfig, {
                onComplete() {
                    watchStatusService.markAsWatched(wizardId);
                },
            });
            intro.start();
        })
        .catch(error => {
            console.error(error.message);
        });
}

export { showWizard, wizardIds };
