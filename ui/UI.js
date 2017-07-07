class UI
{
    constructor(precision, objectsForTracking) {
        this.precision = precision;

        $('#timeScaleSlider').on('input change', this.handleTimeScaleChange.bind(this));
        $('#pauseButton').on('click', this.handlePauseClick.bind(this));

        this.renderHandler = this.handleRender.bind(this);
        document.addEventListener('vr_select', this.handleSelect.bind(this));
        document.addEventListener('vr_deselect', this.handleDeselect.bind(this));

        let selections = '';
        for (const id in objectsForTracking) {
            selections += `<option value="${objectsForTracking[id]}">${id}</option>`;
        }

        const dropdownList = $('#targetSelect');
        dropdownList
            .html(selections)
            .on('change', () => camera.setOrbitingPoint(dropdownList.val(), true))
            .val(EARTH);

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
        const rate = Math.sign(val) * Math.pow(2592000, Math.abs(val));
        // settings.timeScale = 0.001 * Math.sign(val) * Math.pow(2592000, Math.abs(val));
        // settings.timeScale = val;
        $('#timeScaleValue').html(time.formatRate(rate, 2));
        settings.timeScale = rate / 1000;
    }

    handlePauseClick() {
        $('#pauseButton').html((settings.isTimeRunning ^= true) ? 'Pause' : 'Resume');
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

        const data = SSDATA[selection.getSelectedObject().id];
        if (data) {
            $('#relativeTo').html(SSDATA[data.parent].name);
            $('#metricsOf').html(data.name);
        } else {
            $('#relativeTo,#metricsOf').html('');
        }
        document.addEventListener('vr_render', this.renderHandler);
    }

    handleDeselect() {
        $('#metricsPanel').hide();
        document.removeEventListener('vr_render', this.renderHandler);
    }

    updateTarget(value) {
        $('#targetSelect').val(value);
    }

    updateTime(date) {
        $('#currentDateValue').html(date.toLocaleString('ru'));
    }

    updateCartesian(selectedObject) {
        const state = selectedObject.getStateInOwnFrameByEpoch(time.epoch);
        this.updateVector(state, 'velocity');
        this.updateVector(state, 'position');
    }

    updateKeplerian(selectedObject) {
        const keplerianObject = selectedObject.getKeplerianObjectByEpoch(time.epoch);
        $( '#eccValue'  ).html('' +        ( keplerianObject.e         ).toPrecision(this.precision));
        $( '#smaValue'  ).html('' +        ( keplerianObject.sma / 1e6 ).toPrecision(this.precision));
        $( '#incValue'  ).html('' + rad2deg( keplerianObject.inc       ).toPrecision(this.precision));
        $( '#aopValue'  ).html('' + rad2deg( keplerianObject.aop       ).toPrecision(this.precision));
        $( '#raanValue' ).html('' + rad2deg( keplerianObject.raan      ).toPrecision(this.precision));
        $( '#taValue'   ).html('' + rad2deg( keplerianObject.ta        ).toPrecision(this.precision));
    }

    updateVector(state, vec) {
        const stateGroup = state[vec];
        $( `#${vec}Mag` ).html(stateGroup.mag.toPrecision(this.precision));
        $( `#${vec}X`   ).html(stateGroup.  x.toPrecision(this.precision));
        $( `#${vec}Y`   ).html(stateGroup.  y.toPrecision(this.precision));
        $( `#${vec}Z`   ).html(stateGroup.  z.toPrecision(this.precision));
    }

    useRealTimeScale() {
        $('#timeScaleSlider').val(0.001).trigger('change');
    }
}
