import UIPanel from "../Panel";
import Events from "../../core/Events";
import TrajectoryDynamic from "../../core/Trajectory/Dynamic";
import FlightEventImpulsiveBurn from "../../core/FlightEvent/ImpulsiveBurn";
import { sim } from "../../core/Simulation";

export default class UIPanelManeuver extends UIPanel {
    constructor(panelDom) {
        super(panelDom);

        this.increment = 1;

        document.addEventListener(Events.SELECT, this.handleSelect.bind(this));
        document.addEventListener(Events.DESELECT, this.handleDeselect.bind(this));

        this.updateHandler = this.handleTrajectoryUpdate.bind(this);

        this.jqDom.find('#incr001').on('click', () => {this.increment = 0.01});
        this.jqDom.find('#incr01').on('click', () => {this.increment = 0.1});
        this.jqDom.find('#incr1').on('click', () => {this.increment = 1});
        this.jqDom.find('#incr10').on('click', () => {this.increment = 10});
        this.jqDom.find('#incr100').on('click', () => {this.increment = 100});
        this.jqDom.find('#incr1000').on('click', () => {this.increment = 1000});

        this.jqDom.find('#prev-burn').on('click', () => this.setBurnIdx(this.burnIdx - 1));
        this.jqDom.find('#next-burn').on('click', () => this.setBurnIdx(this.burnIdx + 1));

        this.jqDom.find('#epoch-minus').on('click', () => {this.burn.epoch -= this.increment;this.update()});
        this.jqDom.find('#epoch-plus').on('click', () => {this.burn.epoch += this.increment;this.update()});
        for (let comp of ['prograde', 'normal', 'radial']) {
            this.jqDom.find('#' + comp +'-minus').on('click', () => {this.burn[comp] -= this.increment / 1000;this.update()});
            this.jqDom.find('#' + comp + '-plus').on('click', () => {this.burn[comp] += this.increment / 1000;this.update()});
            this.jqDom.find('#' + comp + '-zero').on('click', () => {this.burn[comp] = 0;this.update()});
        }

        this.hide();
    }

    get increment() {
        return this._increment;
    }

    set increment(val) {
        this._increment = val;
        this.jqDom.find('#increment').html(val);
    }

    handleTrajectoryUpdate() {
        this.updateBurns();
        if (this.burns.length > 0) {
            this.show();
        }
        const idx = this.burns.indexOf(this.burn);
        this.setBurnIdx(idx === -1 ? 0 : idx);
    }

    handleSelect(event) {
        if (event.detail.object.trajectory instanceof TrajectoryDynamic) {
            this.init(event.detail.object.trajectory);
        }
    }

    /**
     *
     * @param trajectory {TrajectoryDynamic}
     */
    init(trajectory) {
        this.trajectory = trajectory;
        this.trajectory.onUpdate(this.updateHandler);
        this.updateBurns();
        if (this.burns.length === 0) {
            this.hide();
            return;
        }
        this.show();
        this.setBurnIdx(0);
    }

    updateBurns() {
        this.burns = this.trajectory.flightEvents.filter(event => event instanceof FlightEventImpulsiveBurn);
    }

    setBurnIdx(newIdx) {
        if (newIdx < 0 || newIdx >= this.burns.length) {
            return;
        }
        if (this.burn) {
            this.burn.visualModel.setScale(1);
        }
        this.burnIdx = newIdx;
        this.burn = this.burns[this.burnIdx];
        this.burn.visualModel.setScale(2);

        this.update();
        this.jqDom.find('#burn-name').html('Burn #' + (this.burnIdx + 1));
    }

    handleDeselect() {
        if (this.trajectory) {
            this.trajectory.removeListener(this.updateHandler);
            delete this.trajectory;
            delete this.burn;
            this.hide();
        }
    }

    update() {
        this.jqDom.find('#burn-date')    .html(sim.time.formatDateFull(sim.time.getDateByEpoch(this.burn.epoch)));
        this.jqDom.find('#burn-epoch')   .html(this.burn.epoch.toFixed(2));
        this.jqDom.find('#burn-prograde').html((this.burn.prograde * 1000).toFixed(2));
        this.jqDom.find('#burn-normal')  .html((this.burn.normal * 1000).toFixed(2));
        this.jqDom.find('#burn-radial')  .html((this.burn.radial * 1000).toFixed(2));
        this.jqDom.find('#burn-total')   .html((this.burn.deltaV * 1000).toFixed(2));
    }
}