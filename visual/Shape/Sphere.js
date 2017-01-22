class VisualShapeSphere extends VisualShapeAbstract
{
    constructor(radius, segments) {
        super();
        this.radius = radius;
        this.segments = segments;
    }

    getThreeGeometry() {
        if (!this.threeGeometry) {
            this.threeGeometry = new THREE.SphereGeometry(this.radius, this.segments * 2, this.segments);
            this.threeGeometry.rotateX(Math.PI / 2);
        }

        return this.threeGeometry;
    }
}