class HelperGrid
{
    constructor(centerObject) {
        this.centerObject = centerObject;

        let pow = Math.round(Math.log2(camera.position.mag)); // not supported in some browsers
        //let pow = Math.round(Math.log(camera.position.mag) / Math.log(2));

        this.render(pow);
    }

    render(pow) {
        let pos = TRAJECTORIES[this.centerObject].getPositionByEpoch(time.epoch, RF_BASE);
        this.gridParam = pow;
        this.threeGrid = new THREE.PolarGridHelper(Math.pow(2, pow),
                                                   32,
                                                   32,
                                                   200);
        this.threeGrid.position.fromArray(pos.sub(camera.lastPosition));
        this.threeGrid.quaternion.copy(BODIES[this.centerObject].orientation.getQuaternionByEpoch(time.epoch).toThreejs());
        this.threeGrid.rotateX(Math.PI / 2);

        scene.add(this.threeGrid);
    }

    update(epoch) {
        let pos = TRAJECTORIES[this.centerObject].getPositionByEpoch(epoch, RF_BASE);
        this.threeGrid.position.fromArray(pos.sub(camera.lastPosition));
    }

    onZoom(newDistance) {
        if (KeplerianEditor.isEditMode) {
            let pow = Math.round(Math.log2(newDistance)); // not supported in some browsers
            //let pow = Math.round(Math.log(newDistance) / Math.log(2));

            if (pow != this.gridParam) {
                scene.remove(this.threeGrid);

                this.render(pow);
            }
        }
    }

    remove() {
        scene.remove(this.threeGrid)
    }
}