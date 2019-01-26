import { configure } from "mobx";
import { sim } from "./core/index";
import Application from "./application";

configure({ enforceActions: "always" });

const app = new Application(sim);

window.api = app.getApi();
app.renderUi();
app.init();
