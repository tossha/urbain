class HelperGrid
{
    constructor(referenceFrame) {
        this.referenceFrame = referenceFrame;
        this.centerObject = referenceFrame.origin;

        this.gridSizeParam = Math.round(Math.log2(camera.position.mag));

        this.onRenderListener = this.onRender.bind(this);
        document.addEventListener('vr_render', this.onRenderListener);

        this.zoomListener = this.onZoom.bind(this);
        document.addEventListener('wheel', this.zoomListener);

        this.init();
    }

    init() {
        let pos = App.getTrajectory(this.centerObject).getPositionByEpoch(time.epoch, RF_BASE);

        this.threeGrid = new THREE.PolarGridHelper(
            Math.pow(2, this.gridSizeParam),
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
        let pos = App.getTrajectory(this.centerObject).getPositionByEpoch(event.detail.epoch, RF_BASE);
        this.threeGrid.position.fromArray(pos.sub(camera.lastPosition));
    }

    onZoom() {
        let pow = Math.round(Math.log2(camera.position.mag));

        if (pow != this.gridSizeParam) {
            scene.remove(this.threeGrid);

            this.gridSizeParam = pow;

            this.init();
        }
    }

    remove() {
        scene.remove(this.threeGrid);
        document.removeEventListener('wheel', this.zoomListener);
        document.removeEventListener('vr_render', this.onRenderListener);
    }
}