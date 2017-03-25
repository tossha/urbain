class LineObject extends THREE.Line {
    raycast(raycaster, intersects) {
        const verticesCount = this.geometry.vertices.length;
        let bestIntersection;

        const ray = (new THREE.Ray())
            .copy(raycaster.ray)
            .applyMatrix4(
                (new THREE.Matrix4())
                .getInverse(this.matrixWorld)
            );

        for (let i = 0; i < verticesCount; i++) {
            const vertex1 = (new THREE.Vector3)
                .copy(this.geometry.vertices[i]);

            const vertex2 = (new THREE.Vector3)
                .copy(this.geometry.vertices[(i + 1) % verticesCount]);

            const currentLineDirection = (new THREE.Vector3).subVectors(
                vertex1,
                vertex2
            );

            const commonPerpendicularDirection = (new THREE.Vector3).crossVectors(
                currentLineDirection,
                ray.direction
            );

            const planeNormalVector = (new THREE.Vector3).crossVectors(
                ray.direction,
                commonPerpendicularDirection
            );

            let distanceCoeff = (new THREE.Vector3).subVectors(
                ray.origin,
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
                // вне отркзка
                intersectionPoint =
                    (intersectionPoint.distanceTo(vertex1) < intersectionPoint.distanceTo(vertex2))
                        ? vertex1
                        : vertex2;
            }

            const currentDistance = (new THREE.Vector3).crossVectors(
                (new THREE.Vector3).subVectors(
                    intersectionPoint,
                    ray.origin
                ),
                ray.direction
            ).length();

            if (!bestIntersection || (bestIntersection.distance > currentDistance)) {
                bestIntersection = {
                    distance: currentDistance,
                    point: intersectionPoint,
                    index: i,
                    face: null,
                    faceIndex: null,
                    object: this
                }
            }
        }

        if (bestIntersection
            && (bestIntersection.distance / ray.origin.distanceTo(bestIntersection.point)
                < raycaster.pixelPrecision * raycaster.pixelAngleSize
            )
        ) {
            bestIntersection.point.applyMatrix4(this.matrixWorld);
            intersects.push(bestIntersection);
        }
    }
}
