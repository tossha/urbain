import { sim } from "../core/Simulation";

export default class StarSystemEntry
{
    constructor(idx, alias, label, moduleName) {
        this.idx = idx;
        this.alias = alias;
        this.label = label;
        this.moduleName = moduleName;
    }

    // used in UI
    get value() {
        return this.alias;
    }

    load(callback) {
        if (sim.isModuleLoaded(this.moduleName)) {
            sim.getModule(this.moduleName).loadStarSystem(this.alias, callback);
        } else {
            sim.loadModule(this.moduleName, module => module.loadStarSystem(this.alias, callback));
        }
    }
}
