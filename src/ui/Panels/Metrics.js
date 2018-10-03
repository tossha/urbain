import $ from "jquery";

import UIPanel from "../Panel";
import Events from "../../core/Events";
import UIPanelVector from "./Vector";
import {deg2rad, presentNumberWithSuffix, rad2deg} from "../../algebra";
import EphemerisObject from "../../core/EphemerisObject";

export default class UIPanelMetrics extends UIPanel
{
    constructor(panelDom, selection) {
        super(panelDom);

        this.selection = selection;
        this.precision = 5;

        this.renderListener = this.render.bind(this);

        document.addEventListener(Events.SELECT, this.handleSelect.bind(this));
        document.addEventListener(Events.DESELECT, this.handleDeselect.bind(this));

        this.jqDom.find('#unloadObject').on('click', function() {
            let wasSelected = selection.getSelectedObject().object;
            selection.deselect();
            sim.starSystem.deleteObject(wasSelected.id);
        });
        this.jqDom.find('#showAnglesOfSelectedOrbit').on('change', function() {
            sim.settings.ui.showAnglesOfSelectedOrbit = this.checked;
            if (!selection.getSelectedObject()) {
                return;
            }
            if (this.checked) {
                selection.getSelectedObject().keplerianEditor.init();
            } else {
                selection.getSelectedObject().keplerianEditor.remove();
            }
        });

        this.positionPanel = new UIPanelVector(this.jqDom.find("table[data-panel-name='position_vector']"), null);
        this.velocityPanel = new UIPanelVector(this.jqDom.find("table[data-panel-name='velocity_vector']"), null);

        this.hide();
    }

    render(event) {
        const selectedObject = this.selection.getSelectedObject();
        let parent = null;
        if (!selectedObject) {
            return;
        }

        try {
            const referenceFrame = selectedObject.getReferenceFrameByEpoch(event.detail.epoch);
            if (referenceFrame) {
                parent = sim.starSystem.getObject(referenceFrame.originId);
                this.jqDom.find('#relativeTo').html(parent.name);
            }

            this.updateMain(selectedObject, event.detail.epoch, parent);
            this.updateCartesian(selectedObject, event.detail.epoch);
            this.updateKeplerian(selectedObject, event.detail.epoch);
        } catch (e) {

        }
    }

    updateMain(selectedObject, epoch, parent) {
        const keplerianObject = selectedObject.getKeplerianObjectByEpoch(epoch);
        const sma = keplerianObject.sma;
        const per = sma * (1 - keplerianObject.e);
        const apo = sma * (1 + keplerianObject.e);
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
                rad2deg(keplerianObject.getNodalPrecessionRate(parent.physicalModel.eqRadius, parent.physicalModel.j2) * 86400)
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
        this.jqDom.find('#elements-ecc' ).html('' +        ( keplerianObject.e   ).toPrecision(this.precision));
        this.jqDom.find('#elements-sma' ).html('' + presentNumberWithSuffix(keplerianObject.sma));
        this.jqDom.find('#elements-inc' ).html('' + rad2deg( keplerianObject.inc ).toPrecision(this.precision));
        this.jqDom.find('#elements-aop' ).html('' + rad2deg( keplerianObject.aop ).toPrecision(this.precision));
        this.jqDom.find('#elements-raan').html('' + rad2deg( keplerianObject.raan).toPrecision(this.precision));
        this.jqDom.find('#elements-ta'  ).html('' + rad2deg( keplerianObject.getTrueAnomalyByEpoch(epoch)  ).toPrecision(this.precision));
        this.jqDom.find('#elements-period').html('' + (keplerianObject.period / 86400).toPrecision(this.precision));
    }

    handleSelect() {
        this.show();

        const object = this.selection.getSelectedObject().object;
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

        document.addEventListener(Events.RENDER, this.renderListener);
    }

    handleDeselect() {
        this.hide();
        document.removeEventListener(Events.RENDER, this.renderListener);
    }
}
