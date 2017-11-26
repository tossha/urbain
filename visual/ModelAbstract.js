class VisualModelAbstract
{
    constructor() {
        this.threeObj = null;
        this.scene = null;
        this.sceneReadyListener = this._onSceneReady.bind(this);
        this.renderListener = this._onRender.bind(this);
        document.addEventListener(Events.SCENE_READY, this.sceneReadyListener);
        document.addEventListener(Events.RENDER, this.renderListener);
    }

    _onSceneReady(event) {
        this.scene = event.detail.scene;
        this.onSceneReady();
        document.removeEventListener(Events.SCENE_READY, this.sceneReadyListener);
        delete this.sceneReadyListener;
    }

    onSceneReady() {
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