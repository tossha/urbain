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
        let pos = starSystem.getTrajectory(this.centerObject).getPositionByEpoch(sim.currentEpoch, RF_BASE);

        this.threeGrid = new THREE.PolarGridHelper(
            Math.pow(2, this.gridSizeParameter),
            32,
            32,
            200
        );
        this.threeGrid.position.fromArray(sim.getVisualCoords(pos));
        this.threeGrid.quaternion.copy(this.referenceFrame.getQuaternionByEpoch(sim.currentEpoch).toThreejs());
        this.threeGrid.rotateX(Math.PI / 2);

        sim.scene.add(this.threeGrid);
    }

    onRender(event) {
        let pos = starSystem.getTrajectory(this.centerObject).getPositionByEpoch(event.detail.epoch, RF_BASE);
        this.threeGrid.position.fromArray(sim.getVisualCoords(pos));
    }

    onZoom() {
        let pow = this.getCurrentGridSizeParameter();
        if (pow != this.gridSizeParameter) {
            sim.scene.remove(this.threeGrid);

            this.gridSizeParameter = pow;

            this.init();
        }
    }

    remove() {
        sim.scene.remove(this.threeGrid);
        document.removeEventListener('wheel', this.ZoomListener);
        document.removeEventListener(Events.RENDER, this.onRenderListener);
    }

    getCurrentGridSizeParameter() {
        return Math.round(Math.log2(sim.camera.position.mag))
    }
}