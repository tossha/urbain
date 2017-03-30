class HelperPlane extends THREE.Plane 
{
    raycast(raycaster, intersects) {

        this.visible = true; //it's actually not. Visibility is set true only to satisfy raycaster.

        let A = this.normal.x;
        let B = this.normal.y;
        let C = this.normal.z;

        let point = new THREE.Vector3((this.constant * A) / Math.sqrt((A * A) + (B * B) + (C * C)),
                                      (this.constant * B) / Math.sqrt((A * A) + (B * B) + (C * C)),  
                                      (this.constant * C) / Math.sqrt((A * A) + (B * B) + (C * C)))

        let d = point.dot(this.normal) / raycaster.ray.direction.dot(this.normal);

        intersects.push(raycaster.ray.direction.clone().multiplyScalar(d));
    }
}