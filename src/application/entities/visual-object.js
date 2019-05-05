import { action, computed, observable, runInAction } from "mobx";

export class VisualObject {
    /**
     * @private
     */
    @observable
    _isVisible = false;

    constructor(isVisible = false) {
        runInAction(() => {
            this._isVisible = isVisible;
        });
    }

    /**
     * @public
     */
    @action
    toggle(show) {
        this._isVisible = show === undefined ? !this._isVisible : show;
    }

    /**
     * @public
     * @return {boolean}
     */
    @computed
    get isVisible() {
        return this._isVisible;
    }
}
