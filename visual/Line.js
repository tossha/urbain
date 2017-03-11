class Line extends THREE.Line {
	raycast(raycaster, intersects) {
		var planeNormalVector;
		var currentLineDirection;
		var commonPerpendicularDirection;
		var vertex1, vertex2;
		var distanceCoeff;
		var intersectionPoint;
		var currentDistance;

		for(var i = 0, l =  this.geometry.vertices.length; i < l; i++) {
			vertex1 = this.geometry.vertices[i];
			vertex2 = this.geometry.vertices[(i + 1) % l];

			currentLineDirection = (new THREE.Vector3).subVectors(
				vertex1, 
				vertex2
			);

			commonPerpendicularDirection = (new THREE.Vector3).crossVectors(
				currentLineDirection, 
				raycaster.ray.direction
			);

			planeNormalVector = (new THREE.Vector3).crossVectors(
				raycaster.ray.direction, 
				commonPerpendicularDirection
			);

			distanceCoeff = (new THREE.Vector3).subVectors( 
				raycaster.ray.origin,
				vertex1
			).dot(planeNormalVector);

			distanceCoeff /= planeNormalVector.clone().dot(currentLineDirection);

			intersectionPoint = (new THREE.Vector3).addVectors(
				vertex1,
				currentLineDirection.multiplyScalar(distanceCoeff)
			);


			if((new THREE.Vector3).subVectors(
					vertex1, intersectionPoint
				).dot(
				(new THREE.Vector3).subVectors(
					intersectionPoint, vertex2
			)) < 0) {
				//вне отркзка
				intersectionPoint = 
					intersectionPoint.distanceTo(vertex1) < 
					intersectionPoint.distanceTo(vertex2) ?
					vertex1 :
					vertex2 ;
			}

			currentDistance = (new THREE.Vector3).crossVectors(
				(new THREE.Vector3).subVectors(
					intersectionPoint,
					raycaster.ray.origin
				),
				raycaster.ray.direction
			).length() / raycaster.ray.direction.length();

			if(currentDistance / raycaster.ray.origin.distanceTo(intersectionPoint) <
				raycaster.pixelPrecistion * raycaster.pixelAngleSize
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
