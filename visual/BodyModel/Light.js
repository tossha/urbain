class VisualBodyModelLight extends VisualBodyModelBasic
{
    constructor(shape, color, texturePath, lightColor, lightIntensity, lightDistance, lightDecay) {
        super(shape, color, texturePath);
        this.light = new THREE.PointLight(lightColor, lightIntensity, lightDistance, lightDecay);
    }

    onLoadFinish() {
        super.onLoadFinish();
        this.scene.add(this.light);
    }

    render(epoch) {
        super.render(epoch);
        this.light.position.fromArray(sim.getVisualCoords(this.body.getPositionByEpoch(epoch)));
    }

    getMaterial(parameters) {
        return new THREE.MeshBasicMaterial(parameters);
    }
}