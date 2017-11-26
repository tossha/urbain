class UI
{
    constructor(precision, objectsForTracking) {
        this.precision = precision;

        $('#timeScaleSlider').on('input change', this.handleTimeScaleChange.bind(this));
        $('#pauseButton').on('click', this.togglePause.bind(this));

        this.renderHandler = this.handleRender.bind(this);
        document.addEventListener(Events.SELECT, this.handleSelect.bind(this));
        document.addEventListener(Events.DESELECT, this.handleDeselect.bind(this));

        let selections = '';
        for (const id in objectsForTracking) {
            selections += '<option value="' + id + '">' + objectsForTracking[id] + '</option>';
        }

        $('#showAnglesOfSelectedOrbit').on('change', function() {
            settings.showAnglesOfSelectedOrbit = this.checked;
            if (selection.getSelectedObject()) {
                if (this.checked) {
                    selection.getSelectedObject().keplerianEditor.init();
                } else {
                    selection.getSelectedObject().keplerianEditor.remove();
                }
            }
        });

        const dropdownList = $('#targetSelect');
        dropdownList
            .html(selections)
            .on('change', () => camera.setOrbitingPoint(dropdownList.val(), true))
            .val(settings.trackingObject);

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
        // settings.timeScale = 0.001 * Math.sign(val) * Math.pow(2592000, Math.abs(val));
        // settings.timeScale = val;
        $('#timeScaleValue').html(time.formatRate(rate, 2));
        settings.timeScale = rate / 1000;
    }

    handleRender() {
        const selectedObject = selection.getSelectedObject();
        if (!selectedObject) {
            return;
        }

        this.updateCartesian(selectedObject);
        this.updateKeplerian(selectedObject);
    }

    handleSelect() {
        $('#metricsPanel').show();

        const object = selection.getSelectedObject().object;
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
        const state = selectedObject.getStateInOwnFrameByEpoch(time.epoch);
        this.updateVector(state, 'velocity');
        this.updateVector(state, 'position');
    }

    updateKeplerian(selectedObject) {
        const keplerianObject = selectedObject.getKeplerianObjectByEpoch(time.epoch);
        $('#eccValue' ).html('' +        ( keplerianObject.e   ).toPrecision(this.precision));
        $('#smaValue' ).html('' + presentNumberWithSuffix(keplerianObject.sma));
        $('#incValue' ).html('' + rad2deg( keplerianObject.inc ).toPrecision(this.precision));
        $('#aopValue' ).html('' + rad2deg( keplerianObject.aop ).toPrecision(this.precision));
        $('#raanValue').html('' + rad2deg( keplerianObject.raan).toPrecision(this.precision));
        $('#taValue'  ).html('' + rad2deg( keplerianObject.ta  ).toPrecision(this.precision));
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
        $('#pauseButton').html((settings.isTimeRunning ^= true) ? 'Pause' : 'Resume');
    }
}
