import Module from "../../core/Module";
import Events from "../../core/Events";
import Body from "../../core/Body";
import PropagatorPatchedConics from "./PropagatorPatchedConics";

export default class ModulePatchedConics extends Module
{
    init() {
        sim.addPropagator('patchedConics', PropagatorPatchedConics);
        Events.addListener(Events.LOADING_BODIES_DONE, this.fillSoiTree);
        return this;
    }

    fillSoiTree() {
        let ss = sim.starSystem;

        for (let bodyId in ss.objects) {
            let obj = ss.objects[bodyId];
            if (!(obj instanceof Body))
                continue;

            let parent = ss.getObject(obj.data.patchedConics.parentSoiId);

            if (!(parent instanceof Body))
                continue;

            obj.data.patchedConics.parentSoi = parent;
            parent.data.patchedConics.childSois.push(obj);
        }
    }
}
