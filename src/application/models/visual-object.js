import { action, observable, runInAction } from "mobx";

export class VisualObject {
    constructor(isVisible = false, metaData = null) {
        this._meta = metaData;

        runInAction(() => {
            this._isVisible = isVisible;
        });
    }

    /**
     * @private
     */
    @observable
    _isVisible = false;

    /**
     * @public
     */
    @action
    toggle(show) {
        this._isVisible = show === undefined ? !this._isVisible : show;
    }

    /**
     * @public
     */
    get isVisible() {
        return this._isVisible;
    }

    /**
     * @public
     */
    get meta() {
        return this._meta;
    }
}
