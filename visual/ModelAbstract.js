class VisualModelAbstract
{
    constructor() {
        this.threeObj = null;
        this.scene = null;
        this.loadFinishListener = this._onLoadFinish.bind(this);
        this.renderListener = this._onRender.bind(this);
        document.addEventListener(Events.LOAD_FINISH, this.loadFinishListener);
        document.addEventListener(Events.RENDER, this.renderListener);
    }

    _onLoadFinish(event) {
        this.scene = event.detail.scene;
        this.onLoadFinish();
        document.removeEventListener(Events.LOAD_FINISH, this.loadFinishListener);
        delete this.loadFinishListener;
    }

    onLoadFinish() {
        if (this.threeObj) {
            this.scene.add(this.threeObj);
        }
    }

    _onRender(event) {
        this.render(event.detail.epoch);
    }

    render(epoch) {}
}

VisualModelAbstract.texturePath = 'texture/';