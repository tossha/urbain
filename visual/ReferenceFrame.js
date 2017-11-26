class VisualReferenceFrame extends VisualModelAbstract
{
    constructor(referenceFrame) {
        super();
        
        this.referenceFrame = referenceFrame;

        this.threeObj = new THREE.AxisHelper(1);
    }

    render(epoch) {
        const position = this.referenceFrame.getOriginPositionByEpoch(epoch).sub(camera.lastPosition);
        const scale = position.mag / 10;
        this.threeObj.position.copy(position);
        this.threeObj.quaternion.copy(
            this.referenceFrame.getQuaternionByEpoch(epoch).toThreejs()
        );
        this.threeObj.scale.copy(new Vector([scale, scale, scale]));
    }

    remove() {
        this.scene.remove(this.threeObj);
        this.threeObj.geometry.dispose();
        this.threeObj.remove();
        document.removeEventListener(Events.RENDER, this.renderListener);
    }
}