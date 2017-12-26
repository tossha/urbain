import VisualModelAbstract from "./ModelAbstract";

export default class HelperGrid extends VisualModelAbstract
{
    constructor(referenceFrame) {
        super();

        this.referenceFrame = referenceFrame;

        this.gridSizeParameter = this.getCurrentGridSizeParameter();

        this.zoomListener = this.onZoom.bind(this);
        document.addEventListener('wheel', this.zoomListener);

        let threeGrid = new THREE.PolarGridHelper(
            Math.pow(2, this.gridSizeParameter),
            12,
            12,
            200
        );
        threeGrid.geometry.rotateX(Math.PI / 2);

        this.setThreeObj(threeGrid);
    }

    hide() {
        this.threeObj.visible = false;
    }

    show() {
        this.threeObj.visible = true;
    }

    render(epoch) {
        let pos = this.referenceFrame.getOriginPositionByEpoch(epoch);
        this.threeObj.position.copy(sim.getVisualCoords(pos));
        this.threeObj.quaternion.copy(this.referenceFrame.getQuaternionByEpoch(epoch).toThreejs())
    }

    onZoom() {
        let pow = this.getCurrentGridSizeParameter();
        if (pow != this.gridSizeParameter) {
            this.drop();

            this.gridSizeParameter = pow;

            let threeGrid = new THREE.PolarGridHelper(
                Math.pow(2, this.gridSizeParameter),
                12,
                12,
                200
            );
            threeGrid.geometry.rotateX(Math.PI / 2);

            this.setThreeObj(threeGrid);
        }
    }

    remove() {
        this.drop();
        document.removeEventListener('wheel', this.zoomListener);
    }

    getCurrentGridSizeParameter() {
        return Math.round(Math.log2(sim.camera.position.mag))
    }
}