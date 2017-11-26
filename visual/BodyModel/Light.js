class VisualBodyModelLight extends VisualBodyModelBasic
{
    constructor(shape, color, texturePath, lightColor, lightIntensity, lightDistance, lightDecay) {
        super(shape, color, texturePath);
        this.light = new THREE.PointLight(lightColor, lightIntensity, lightDistance, lightDecay);
    }

    onSceneReady() {
        super.onSceneReady();
        this.scene.add(this.light);
    }

    render(epoch) {
        super.render(epoch);
        this.light.position.fromArray(this.body.getPositionByEpoch(epoch).sub(camera.lastPosition));
    }

    getMaterial(parameters) {
        return new THREE.MeshBasicMaterial(parameters);
    }
}