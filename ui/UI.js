class UI
{
    constructor(precision) {
        this.precision = precision;
    }

    update() {
        const selectedObject = selection.getSelectedObject();
        $('#metricsPanel')[selectedObject ? 'show' : 'hide']();

        if (!selectedObject) {
            return;
        }

        this.updateCartessian(selectedObject);
        this.updateKeplerian(selectedObject);
    }

    updateCartessian(selectedObject) {
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
        this.updateCoordinate(stateGroup, vec, 'Mag');
        this.updateCoordinate(stateGroup, vec, 'X');
        this.updateCoordinate(stateGroup, vec, 'Y');
        this.updateCoordinate(stateGroup, vec, 'Z');
    }

    updateCoordinate(stateGroup, vec, coord) {
        const selector = $('#' + vec + coord);
        selector.html('' + stateGroup[coord.toLowerCase()].toPrecision(this.precision));
    }
}
