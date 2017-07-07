function updateInterface() {
    const selectedObject = selection.getSelectedObject();
    $('#metricsPanel')[selectedObject ? 'show' : 'hide']();

    if (!selectedObject) {
        return;
    }

    const state = selectedObject.getStateInOwnFrameByEpoch(time.epoch);

    function displayVector(vec) {
        const stateGroup = state[vec];

        function displayCoord(coord) {
            const selector = $('#' + vec + coord);
            selector.html('' + stateGroup[coord.toLowerCase()].toPrecision(5));
        }

        displayCoord('X');
        displayCoord('Y');
        displayCoord('Z');
        displayCoord('Mag');
    }

    displayVector('velocity');
    displayVector('position');

    const keplerianObject = selectedObject.getKeplerianObjectByEpoch(time.epoch);
    $('#eccValue').html('' + ( keplerianObject.e         ).toPrecision(5));
    $('#smaValue').html('' + ( keplerianObject.sma / 1e6 ).toPrecision(5));
    $('#incValue').html('' + rad2deg(keplerianObject.inc).toPrecision(5));
    $('#aopValue').html('' + rad2deg(keplerianObject.aop).toPrecision(5));
    $('#raanValue').html('' + rad2deg(keplerianObject.raan).toPrecision(5));
    $('#taValue').html('' + rad2deg(keplerianObject.ta).toPrecision(5));
}
