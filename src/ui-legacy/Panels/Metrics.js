import $ from "jquery";

import UIPanel from "../Panel";
import Events from "../../core/Events";
import UIPanelVector from "./Vector";
import {presentNumberWithSuffix, rad2deg} from "../../core/algebra";
import EphemerisObject from "../../core/EphemerisObject";
import { TWENTY_FOUR_HOURS_IN_SECONDS } from "../../constants/dates";

export default class UIPanelMetrics extends UIPanel {
    /**
     * @param panelDom
     * @param {SimulationEngine} simulationEngine
     */
    constructor(panelDom, simulationEngine) {
        super(panelDom);

        this.precision = 5;
        this._simulationEngine = simulationEngine;

        Events.addListener(Events.SELECT, this.handleSelect);
        Events.addListener(Events.DESELECT, this.handleDeselect);

        this.jqDom.find('#unloadObject').on('click', function() {
            let wasSelected = simulationEngine.selection.getSelectedObject();
            simulationEngine.selection.deselect();
            simulationEngine.starSystem.deleteObject(wasSelected.id);
        });
        this.jqDom.find('#showAnglesOfSelectedOrbit').on('change', function() {
            simulationEngine.settings.ui.showAnglesOfSelectedOrbit = this.checked;
            Events.dispatch(Events.SHOW_ORBIT_ANGLES_CHANGED, {value: this.checked});
        });

        this.positionPanel = new UIPanelVector(this.jqDom.find(".js-metrics-panel-cartesian-position-vector"), null);
        this.velocityPanel = new UIPanelVector(this.jqDom.find(".js-metrics-panel-cartesian-velocity-vector"), null);

        this.hide();
    }

    render = event => {
        const selectedTrajectory = this._simulationEngine.selection.getSelectedObject().trajectory;
        let parent = null;
        if (!selectedTrajectory) {
            return;
        }

        try {
            const referenceFrame = selectedTrajectory.getReferenceFrameByEpoch(event.detail.epoch);
            if (referenceFrame) {
                parent = this._simulationEngine.starSystem.getObject(referenceFrame.originId);
                this.jqDom.find('#relativeTo').html(parent.name);
            }

            this.updateMain(selectedTrajectory, event.detail.epoch, parent);
            this.updateCartesian(selectedTrajectory, event.detail.epoch);
            this.updateKeplerian(selectedTrajectory, event.detail.epoch);
        } catch (e) {

        }
    };

    updateMain(selectedObject, epoch, parent) {
        const keplerianObject = selectedObject.getKeplerianObjectByEpoch(epoch);
        const sma = keplerianObject.sma;
        const per = sma * (1 - keplerianObject.ecc);
        const apo = sma * (1 + keplerianObject.ecc);
        const surfaceAlt = parent.physicalModel ? parent.physicalModel.radius : 0;
        const state = selectedObject.getStateInOwnFrameByEpoch(epoch);

        this.jqDom.find('#elements-orbit-alt' ).html(
            '' + (per - surfaceAlt).toPrecision(this.precision)
            + ' x ' + (apo - surfaceAlt).toPrecision(this.precision)
        );

        this.jqDom.find('#elements-orbit-avg' ).html(''   + (sma - surfaceAlt).toPrecision(this.precision));
        this.jqDom.find('#elements-alt' ).html(''   + (state.position.mag - surfaceAlt).toPrecision(this.precision));
        this.jqDom.find('#elements-speed' ).html('' + (state.velocity.mag * 1000).toPrecision(this.precision));

        if (parent.physicalModel && parent.physicalModel.j2 && parent.physicalModel.j2) {
            this.jqDom.find('#elements-precession').html('' + (
                rad2deg(keplerianObject.getNodalPrecessionRate(parent.physicalModel.eqRadius, parent.physicalModel.j2) * TWENTY_FOUR_HOURS_IN_SECONDS)
            ).toPrecision(this.precision));
        }
    }

    updateCartesian(selectedObject, epoch) {
        const state = selectedObject.getStateInOwnFrameByEpoch(epoch);
        this.positionPanel.set(state.position);
        this.velocityPanel.set(state.velocity);
    }

    updateKeplerian(selectedObject, epoch) {
        const keplerianObject = selectedObject.getKeplerianObjectByEpoch(epoch);
        this.jqDom.find('#elements-ecc' ).html('' +        ( keplerianObject.ecc ).toPrecision(this.precision));
        this.jqDom.find('#elements-sma' ).html('' + presentNumberWithSuffix(keplerianObject.sma));
        this.jqDom.find('#elements-inc' ).html('' + rad2deg( keplerianObject.inc ).toPrecision(this.precision));
        this.jqDom.find('#elements-aop' ).html('' + rad2deg( keplerianObject.aop ).toPrecision(this.precision));
        this.jqDom.find('#elements-raan').html('' + rad2deg( keplerianObject.raan).toPrecision(this.precision));
        this.jqDom.find('#elements-ta'  ).html('' + rad2deg( keplerianObject.getTrueAnomalyByEpoch(epoch)  ).toPrecision(this.precision));
        this.jqDom.find('#elements-period').html('' + (keplerianObject.period / TWENTY_FOUR_HOURS_IN_SECONDS).toPrecision(this.precision));
    }

    handleSelect = ({ detail }) => {
        this.show();

        const object = detail.object;
        if (object) {
            $('#metricsOf').html(object.name);
        } else {
            $('#relativeTo,#metricsOf').html('');
        }

        if (object.type === EphemerisObject.TYPE_SPACECRAFT || object.type === EphemerisObject.TYPE_UNKNOWN) {
            this.jqDom.find('#unloadObject').show();
        } else {
            this.jqDom.find('#unloadObject').hide();
        }

        Events.addListener(Events.RENDER, this.render);
    };

    handleDeselect = () => {
        this.hide();
        Events.removeListener(Events.RENDER, this.render);
    };
}
