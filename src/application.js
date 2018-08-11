import { init } from "./core/index";
import { loadTLE } from "./api";
import { Store } from "./store";

class Application {
    constructor(sim, statsBadge) {
        init(statsBadge);
        this._store = new Store(sim);
    }

    getInitialState() {
        return this._store;
    }

    getApi() {
        return {
            loadTLE,
        };
    }
}

export default Application;
