import * as THREE from "three";

export default class VirtualPlane extends THREE.Plane
{
    raycast(raycaster, intersects) {

        this.visible = true; //it's actually not. Visibility is true only to satisfy raycaster.

        const d = this.constant / raycaster.ray.direction.dot(this.normal);

        if (d < 0) {
            return;
        }

        let intersectionPoint = raycaster.ray.direction.clone().multiplyScalar(d);

        intersects.push({
            distance  : intersectionPoint.length(),
            point     : intersectionPoint,
            index     : 0,
            face      : null,
            faceIndex : null,
            object    : this
        });
    }
}
