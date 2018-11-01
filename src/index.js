import { sim } from "./core/index";
import { renderUi, statsBadge } from "./ui/index";
import Application from "./application";

const app = new Application(sim);
const initialState = app.getInitialState();
window.api = app.getApi();

renderUi(initialState);

app.init(statsBadge);
