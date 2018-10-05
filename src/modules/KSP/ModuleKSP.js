import Module from "../../core/Module";
import { sim } from "../../core/Simulation";

export default class ModuleKSP extends Module
{
    init() {
        sim.loadStarSystem('ksp.json');
    }
}
