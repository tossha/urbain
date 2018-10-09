import { init } from "./core/index";
import { loadTLE, loadKSP } from "./api";
import { Store } from "./store";

class Application {
    constructor(sim) {
        this._store = new Store(sim);
    }

    init(statsBadge) {
        init(statsBadge);
    }

    getInitialState() {
        return this._store;
    }

    getApi() {
        return {
            loadTLE,
            loadKSP,
        };
    }
}

export default Application;
