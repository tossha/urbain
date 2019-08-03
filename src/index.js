import { configure } from "mobx";
import Application from "./application";

configure({ enforceActions: "always" });

const app = new Application();

app.loadDefaultUniverse().then(() => {
    app.startRendering();
    app.registerShortcuts();
    app.configureGlobalSettings();

    window.api = app.getApi();
});
