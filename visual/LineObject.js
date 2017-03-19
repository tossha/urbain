class LineObject extends THREE.Line {
    raycast(raycaster, intersects) {
        const verticesCount = this.geometry.vertices.length;

        for (let i = 0; i < verticesCount; i++) {
            const vertex1 = this.geometry.vertices[i];
            const vertex2 = this.geometry.vertices[(i + 1) % verticesCount];

            const currentLineDirection = (new THREE.Vector3).subVectors(
                vertex1,
                vertex2
            );

            const commonPerpendicularDirection = (new THREE.Vector3).crossVectors(
                currentLineDirection,
                raycaster.ray.direction
            );

            const planeNormalVector = (new THREE.Vector3).crossVectors(
                raycaster.ray.direction,
                commonPerpendicularDirection
            );

            let distanceCoeff = (new THREE.Vector3).subVectors(
                raycaster.ray.origin,
                vertex1
            ).dot(planeNormalVector);

            distanceCoeff /= planeNormalVector.clone().dot(currentLineDirection);

            let intersectionPoint = (new THREE.Vector3).addVectors(
                vertex1,
                currentLineDirection.multiplyScalar(distanceCoeff)
            );

            if ((new THREE.Vector3).subVectors(
                    vertex1, intersectionPoint
                ).dot(
                    (new THREE.Vector3).subVectors(
                        intersectionPoint, vertex2
                    )
                ) < 0
            ) {
                //вне отркзка
                intersectionPoint =
                    (intersectionPoint.distanceTo(vertex1) < intersectionPoint.distanceTo(vertex2))
                        ? vertex1
                        : vertex2;
            }

            const currentDistance = (new THREE.Vector3).crossVectors(
                (new THREE.Vector3).subVectors(
                    intersectionPoint,
                    raycaster.ray.origin
                ),
                raycaster.ray.direction
            ).length() / raycaster.ray.direction.length();

            if (currentDistance / raycaster.ray.origin.distanceTo(intersectionPoint)
                < raycaster.pixelPrecision * raycaster.pixelAngleSize
            ) {
                intersects.push({
                    distance: currentDistance,
                    point: intersectionPoint,
                    index: i,
                    face: null,
                    faceIndex: null,
                    object: this
                });
            }
        }
    }
}
