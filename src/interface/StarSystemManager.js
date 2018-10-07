
import StarSystemEntry from "./StarSystemEntry";

export default class StarSystemManager
{
    constructor() {
        this.list = [];

        // The first one loads by default
        this.add('solar_system', 'SolarSystem', 'Solar System');
        this.add('ksp', 'KSP', 'KSP System');

        this.loadedIdx = false;
    }

    add(alias, module, label) {
        this.list.push(new StarSystemEntry(
            this.list.length,
            alias,
            label,
            module
        ));
    }

    loadDefault() {
        this.loadByIdx(0);
    }

    loadByIdx(idx) {
        this.list[idx].load();
        this.loadedIdx = idx;
    }

    getCurrentStarSystem() {
        if (this.loadedIdx === false) {
            return false;
        }
        return this.list[this.loadedIdx];
    }
}
