import Module from "../../core/Module";
import Events from "../../core/Events";
import EphemerisObject from "../../core/EphemerisObject";
import Body from "../../core/Body";
import PropagatorPatchedConics from "./PropagatorPatchedConics";
import { sim } from "../../core/simulation-engine";
import VisualFlightEventSOIArrival from "./visual/FlightEvent/SOIArrival";
import VisualFlightEventSOIDeparture from "./visual/FlightEvent/SOIDeparture";

export default class ModulePatchedConics extends Module
{
    init() {
        this.root = null;

        sim.addPropagator('patchedConics', PropagatorPatchedConics);
        Events.addListener(Events.LOADING_BODIES_DONE, () => this.fillSoiTree());
        if (sim.starSystem) {
            this.fillSoiTree();
        }

        VisualFlightEventSOIArrival.preloadTexture();
        VisualFlightEventSOIDeparture.preloadTexture();
    }

    fillSoiTree() {
        let ss = sim.starSystem;

        for (let bodyId in ss.objects) {
            let obj = ss.objects[bodyId];
            if (!(obj instanceof Body) || obj.data.patchedConics === undefined)
                continue;

            if (obj.type === EphemerisObject.TYPE_STAR)
                this.root = obj;

            let parent = ss.getObject(obj.data.patchedConics.parentSoiId);

            if (!(parent instanceof Body)) {
                continue;
            }

            obj.data.patchedConics.parentSoi = parent;
            parent.data.patchedConics.childSois.push(obj);
        }
    }

    getRootSoi() {
        return this.root;
    }

    getCommonParent(body1, body2) {
        let chain1 = [body1];
        let parent;

        while (parent = sim.starSystem.getObject(chain1[chain1.length - 1]).data.patchedConics.parentSoiId) {
            chain1.push(parent);
        }

        parent = body2;
        do {
            if (chain1.indexOf(parent) !== -1) {
                return sim.starSystem.getObject(parent);
            }
            parent = sim.starSystem.getObject(parent).data.patchedConics.parentSoiId;
        } while (parent);

        return null;
    }

    getRelativePeriod(body1, body2, epoch) {
        let chain1 = [body1];
        let parent, idx;

        while (parent = sim.starSystem.getObject(chain1[chain1.length - 1]).data.patchedConics.parentSoiId) {
            if (parent == body2) {
                return null;
            }
            chain1.push(parent);
        }

        let obj = body2;
        while (parent = sim.starSystem.getObject(obj).data.patchedConics.parentSoiId) {
            if ((idx = chain1.indexOf(parent)) !== -1) {
                if (idx === 0) {
                    return null;
                }

                let period1 = sim.starSystem.getObject(chain1[idx - 1]).trajectory.getKeplerianObjectByEpoch(epoch).period;
                let period2 = sim.starSystem.getObject(obj).trajectory.getKeplerianObjectByEpoch(epoch).period;

                return {
                    period1: period1,
                    period2: period2,
                    relativePeriod: 1 / Math.abs(1 / period1 - 1 / period2)
                };
            }
            obj = parent;
        }

        return null;

    }
}
