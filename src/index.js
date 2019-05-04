import { configure } from "mobx";
import Application from "./application";

configure({ enforceActions: "always" });

const app = new Application();

app.renderUi();
app.initSimulation();

window.api = app.getApi();
