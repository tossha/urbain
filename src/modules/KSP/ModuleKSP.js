import Module from "../../core/Module";
import { sim } from "../../core/Simulation";

export default class ModuleKSP extends Module
{
    loadStarSystem() {
        sim.loadStarSystem('ksp.json');
    }
}
