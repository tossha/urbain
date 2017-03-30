class HelperGrid
{
    constructor(centerObject) {
        this.centerObject = centerObject;

        this.gridSizeParam = Math.round(Math.log2(camera.position.mag)); // not supported in some browsers
        //this.gridSizeParam = Math.round(Math.log(camera.position.mag) / Math.log(2));
        this.render();
    }

    render() {
        let pos = App.getTrajectory(this.centerObject).getPositionByEpoch(time.epoch, RF_BASE);
        
        this.gridVisual = new THREE.PolarGridHelper(Math.pow(2, this.gridSizeParam),
                                                   32,
                                                   32,
                                                   200);
        this.gridVisual.position.fromArray(pos.sub(camera.lastPosition));
        this.gridVisual.quaternion.copy(BODIES[this.centerObject].orientation.getQuaternionByEpoch(time.epoch).toThreejs());
        this.gridVisual.rotateX(Math.PI / 2);

        scene.add(this.gridVisual);

        this.zoomListener = this.onZoom.bind(this);
        document.addEventListener('wheel', this.zoomListener);
    }

    update(epoch) {
        let pos = App.getTrajectory(this.centerObject).getPositionByEpoch(epoch, RF_BASE);
        this.gridVisual.position.fromArray(pos.sub(camera.lastPosition));
    }

    onZoom() {
        let pow = Math.round(Math.log2(camera.position.mag)); // not supported in some browsers
        //let pow = Math.round(Math.log(newDistance) / Math.log(2));

        if (pow != this.gridSizeParam) {
            scene.remove(this.gridVisual);

            this.gridSizeParam = pow;

            this.render();
        }
    }

    remove() {
        scene.remove(this.gridVisual);
        document.removeEventListener('wheel', this.zoomListener);
    }
}