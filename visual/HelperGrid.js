class HelperGrid
{
    constructor(referenceFrame) {
        this.referenceFrame = referenceFrame;
        this.centerObject = referenceFrame.origin;

        this.gridSizeParameter = this.getCurrentGridSizeParameter();

        this.onRenderListener = this.onRender.bind(this);
        document.addEventListener(Events.RENDER, this.onRenderListener);

        this.ZoomListener = this.onZoom.bind(this);
        document.addEventListener('wheel', this.ZoomListener);

        this.init();
    }

    init() {
        let pos = starSystem.getTrajectory(this.centerObject).getPositionByEpoch(time.epoch, RF_BASE);

        this.threeGrid = new THREE.PolarGridHelper(
            Math.pow(2, this.gridSizeParameter),
            32,
            32,
            200
        );
        this.threeGrid.position.fromArray(pos.sub(camera.lastPosition));
        this.threeGrid.quaternion.copy(this.referenceFrame.getQuaternionByEpoch(time.epoch).toThreejs());
        this.threeGrid.rotateX(Math.PI / 2);

        scene.add(this.threeGrid);
    }

    onRender(event) {
        let pos = starSystem.getTrajectory(this.centerObject).getPositionByEpoch(event.detail.epoch, RF_BASE);
        this.threeGrid.position.fromArray(pos.sub(camera.lastPosition));
    }

    onZoom() {
        let pow = this.getCurrentGridSizeParameter();
        if (pow != this.gridSizeParameter) {
            scene.remove(this.threeGrid);

            this.gridSizeParameter = pow;

            this.init();
        }
    }

    remove() {
        scene.remove(this.threeGrid);
        document.removeEventListener('wheel', this.ZoomListener);
        document.removeEventListener(Events.RENDER, this.onRenderListener);
    }

    getCurrentGridSizeParameter() {
        return Math.round(Math.log2(camera.position.mag))
    }
}