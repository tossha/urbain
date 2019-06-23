import UIPanel from "../Panel";
import EphemerisObject from "../../core/EphemerisObject";
import TrajectoryKeplerianBasic from "../../core/Trajectory/KeplerianBasic";
import ReferenceFrameFactory, {ReferenceFrame} from "../../core/ReferenceFrame/Factory";
import VisualTrajectoryModelKeplerian from "../../core/visual/Trajectory/Keplerian";
import KeplerianObject from "../../core/KeplerianObject";
import TrajectoryDynamic from "../../core/Trajectory/Dynamic";
import { sim } from "../../core/simulation-engine";
import VisualTrajectoryDynamic from "../../core/visual/Trajectory/Dynamic";
import FlightEventSOIDeparture from "../../modules/PatchedConics/FlightEvent/SOIDeparture";
import FlightEventSOIArrival from "../../modules/PatchedConics/FlightEvent/SOIArrival";
import FlightEventImpulsiveBurn from "../../core/FlightEvent/ImpulsiveBurn";
import {Vector} from "../../core/algebra";

export default class UIPanelCreation extends UIPanel {
    constructor(panelDom) {
        super(panelDom);

        this.jqCreate = this.jqDom.find('#createOrbit');
        this.jqCreate.click(() => {
            const center = sim.camera.orbitingPoint;
            const object = sim.starSystem.getObject(center);
            if (!object.physicalModel) {
                return;
            }
            const sma = object.physicalModel.radius * 2;
            const id = -11000000 - sim.starSystem.created;
            sim.starSystem.created += 1;

            let traj = new TrajectoryKeplerianBasic(
                ReferenceFrameFactory.buildId(center, ReferenceFrame.INERTIAL_BODY_EQUATORIAL),
                new KeplerianObject(
                    0.2, sma, Math.PI / 6, Math.PI / 3, Math.PI / 6, 0, sim.currentEpoch, object.physicalModel.mu
                )
            );
            traj.setVisualModel(new VisualTrajectoryModelKeplerian(traj, {color: 'yellow'}));
            traj.minEpoch = false;
            traj.maxEpoch = false;

            const propagatorClass = sim.getPropagator('patchedConics');
            let pTraj = new TrajectoryDynamic(new propagatorClass());
            pTraj.setVisualModel(new VisualTrajectoryDynamic(pTraj, {color: 'yellow'}));
            pTraj.addComponent(traj);

            let ephObject = new EphemerisObject(id, EphemerisObject.TYPE_UNKNOWN, "Created #" + sim.starSystem.created);
            ephObject.setTrajectory(pTraj);
            sim.starSystem.addObject(id, ephObject);
            sim.selection.forceSelection(ephObject);

            pTraj.propagate(traj.epoch);
        });

        this.jqImport = this.jqDom.find('#importOrbit');
        this.jqImport.click(() => {
            let dump = JSON.parse(this.jqDom.find('#dump').val());
            if (!dump) {
                console.log('Bad json');
                return;
            }
            if (!dump.components || !dump.visualModel) {
                console.log('No components or visualModel found');
                return;
            }

            const propagatorClass = sim.getPropagator('patchedConics');
            let pTraj = new TrajectoryDynamic(new propagatorClass());
            pTraj.setVisualModel(new VisualTrajectoryDynamic(pTraj, dump.visualModel));
            let lastComponent = false;

            for (let componentDump of dump.components) {
                let traj = new TrajectoryKeplerianBasic(
                    componentDump.referenceFrame,
                    new KeplerianObject(
                        componentDump.keplerianObject.ecc,
                        componentDump.keplerianObject.sma,
                        componentDump.keplerianObject.aop,
                        componentDump.keplerianObject.inc,
                        componentDump.keplerianObject.loan,
                        componentDump.keplerianObject.m0,
                        componentDump.keplerianObject.epoch,
                        componentDump.keplerianObject.mu,
                        false,
                    )
                );
                traj.setVisualModel(new VisualTrajectoryModelKeplerian(traj, componentDump.visualModel));
                traj.minEpoch = componentDump.minEpoch;
                traj.maxEpoch = componentDump.maxEpoch;

                if (lastComponent && lastComponent.referenceFrame.id !== traj.referenceFrame.id) {
                    const oldSoi = sim.starSystem.getObject(lastComponent.referenceFrame.originId);
                    const newSoi = sim.starSystem.getObject(traj.referenceFrame.originId);
                    lastComponent.addFlightEvent(new FlightEventSOIDeparture(
                        traj.minEpoch,
                        oldSoi,
                        newSoi
                    ));
                    traj.addFlightEvent(new FlightEventSOIArrival(
                        traj.minEpoch,
                        oldSoi,
                        newSoi
                    ));
                }

                pTraj.addComponent(traj);
                lastComponent = traj;
            }

            for (let eventDump of dump.events) {
                pTraj.addFlightEvent((new FlightEventImpulsiveBurn(
                    eventDump.epoch,
                    new Vector([eventDump.x, eventDump.y, eventDump.z])
                )).onUpdate((newEvent, oldEvent) => {
                    pTraj.sortFlightEvents();
                    pTraj.propagate(Math.min(oldEvent.epoch, newEvent.epoch));
                }));
            }

            const id = -11000000 - sim.starSystem.created;
            sim.starSystem.created++;
            let ephObject = new EphemerisObject(id, EphemerisObject.TYPE_UNKNOWN, "Created #" + sim.starSystem.created);
            ephObject.setTrajectory(pTraj);
            sim.starSystem.addObject(id, ephObject);
            sim.selection.forceSelection(ephObject);
        });
    }
}
