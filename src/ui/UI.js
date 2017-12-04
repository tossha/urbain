import {Events} from "../core/Events";
import {presentNumberWithSuffix, rad2deg} from "../algebra";
import Camera from "../core/Camera"

export default class UI
{
    constructor(precision, objectsForTracking) {
        this.precision = precision;

        $('#timeScaleSlider').val(Math.log(sim.time.timeScale * 1000) / Math.log(984362.83) / 1.2).on('input change', this.handleTimeScaleChange.bind(this));
        $('#pauseButton').on('click', () => sim.time.togglePause());

        this.renderHandler = this.handleRender.bind(this);
        document.addEventListener(Events.SELECT, this.handleSelect.bind(this));
        document.addEventListener(Events.DESELECT, this.handleDeselect.bind(this));

        this.showAnglesOfSelectedOrbit = true;

        $('#showAnglesOfSelectedOrbit').on('change', function() {
            sim.ui.showAnglesOfSelectedOrbit = this.checked;
            if (sim.selection.getSelectedObject()) {
                if (this.checked) {
                    sim.selection.getSelectedObject().keplerianEditor.init();
                } else {
                    sim.selection.getSelectedObject().keplerianEditor.remove();
                }
            }
        });

        const dropdownList1 = $('#targetSelect');
        let selections = '';
        for (const id in objectsForTracking) {
            selections += '<option value="' + id + '">' + objectsForTracking[id] + '</option>';
        }
        dropdownList1
            .html(selections)
            .on('change', () => sim.camera.changeOrigin(dropdownList1.val()))
            .val(sim.camera.referenceFrame.originId);


        const dropdownList2 = $('#rfTypeSelect');
        selections = '';
        for (const id in Camera.selectableReferenceFrameTypes) {
            selections += '<option value="' + id + '">' + Camera.selectableReferenceFrameTypes[id] + '</option>';
        }
        dropdownList2
            .html(selections)
            .on('change', () => sim.camera.changeReferenceFrameType(dropdownList2.val()))
            .val(sim.camera.frameType);

        this.handleTimeScaleChange();
        this.handleDeselect();
        this.handleRender();
    }

    changeVisibility(name) {
        const selector = $('.' + name);
        const button = $(`#${name}ToggleButton`);
        button.attr('disabled', 'true');
        selector.fadeToggle(200, 'swing', () => {
            button.html(selector.is(':visible') ? 'Hide' : 'Show');
            button.removeAttr('disabled');
        });
    }

    handleTimeScaleChange() {
        const val = +$('#timeScaleSlider').val();
        const rate = Math.sign(val) * Math.pow(984362.83, 1.2 * Math.abs(val));

        $('#timeScaleValue').html(sim.time.formatRate(rate, 2));
        sim.time.setTimeScale(rate / 1000);
    }

    handleRender() {
        const selectedObject = sim.selection.getSelectedObject();
        if (!selectedObject) {
            return;
        }

        this.updateCartesian(selectedObject);
        this.updateKeplerian(selectedObject);
    }

    handleSelect() {
        $('#metricsPanel').show();

        const object = sim.selection.getSelectedObject().object;
        if (object) {
            // $('#relativeTo').html(object.trajectory.referenceFrame.name);
            $('#metricsOf').html(object.name);
        } else {
            $('#relativeTo,#metricsOf').html('');
        }
        document.addEventListener(Events.RENDER, this.renderHandler);
    }

    handleDeselect() {
        $('#metricsPanel').hide();
        document.removeEventListener(Events.RENDER, this.renderHandler);
    }

    updateTarget(value) {
        $('#targetSelect').val(value);
    }

    updateFrameType(value) {
        $('#rfTypeSelect').val(value);
    }

    updateTime(date) {
        let string = date.getYear() + 1900;
        string += '-' + (date.getMonth() + 1);
        string += '-' + date.getDate();
        string += ' ' + (date.getHours() + '').padStart(2, '0');
        string += ':' + (date.getMinutes() + '').padStart(2, '0');
        string += ':' + (date.getSeconds() + '').padStart(2, '0');
        $('#currentDateValue').html(string);
    }

    updateCartesian(selectedObject) {
        const state = selectedObject.getStateInOwnFrameByEpoch(sim.currentEpoch);
        this.updateVector(state, 'velocity');
        this.updateVector(state, 'position');
    }

    updateKeplerian(selectedObject) {
        const keplerianObject = selectedObject.getKeplerianObjectByEpoch(sim.currentEpoch);
        $('#eccValue' ).html('' +        ( keplerianObject.e   ).toPrecision(this.precision));
        $('#smaValue' ).html('' + presentNumberWithSuffix(keplerianObject.sma));
        $('#incValue' ).html('' + rad2deg( keplerianObject.inc ).toPrecision(this.precision));
        $('#aopValue' ).html('' + rad2deg( keplerianObject.aop ).toPrecision(this.precision));
        $('#raanValue').html('' + rad2deg( keplerianObject.raan).toPrecision(this.precision));
        $('#taValue'  ).html('' + rad2deg( keplerianObject.getTrueAnomalyByEpoch(sim.currentEpoch)  ).toPrecision(this.precision));
    }

    updateVector(state, vec) {
        const stateGroup = state[vec];
        $(`#${vec}Mag`).html(presentNumberWithSuffix(stateGroup.mag));
        $(`#${vec}X`  ).html(presentNumberWithSuffix(stateGroup.x));
        $(`#${vec}Y`  ).html(presentNumberWithSuffix(stateGroup.y));
        $(`#${vec}Z`  ).html(presentNumberWithSuffix(stateGroup.z));
    }

    useRealTimeScale() {
        $('#timeScaleSlider').val(0.001).trigger('change');
    }

    togglePause() {
        $('#pauseButton').html((sim.time.isTimeRunning) ? 'Pause' : 'Resume');
    }
}
