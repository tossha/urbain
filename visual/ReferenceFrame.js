class VisualReferenceFrame
{
    constructor(referenceFrame) {
        this.referenceFrame = referenceFrame;

        this.axisHelper = new THREE.AxisHelper(1);

        scene.add(this.axisHelper);

        this.renderListener = this.render.bind(this);
        document.addEventListener('vr_render', this.renderListener);
    }

    render(event) {
        const position = this.referenceFrame.getOriginPositionByEpoch(event.detail.epoch).sub(camera.lastPosition);
        const scale = position.magnitude() / 10;
        this.axisHelper.position.copy(position);
        this.axisHelper.quaternion.copy(
            this.referenceFrame.getQuaternionByEpoch(event.detail.epoch).toThreejs()
        );
        this.axisHelper.scale.copy(new Vector([scale, scale, scale]));
    }

    remove() {
        this.axisHelper.remove();
        document.removeEventListener('vr_render', this.renderListener);
    }
}