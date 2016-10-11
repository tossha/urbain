"use strict";

class AbstractTrajectory {
	constructor(parentTrajectory) {
		this.parentTrajectory = parentTrajectory || null;
	}

	getPosition(time) {}
}

class StaticTrajectory extends AbstractTrajectory {
	constructor(parentTrajectory, position) {
		super(parentTrajectory);
		this.position = position || ZERO_VECTOR;
	}

	getPosition(time) {
		var parentPosition = this.parentTrajectory ?
			this.parentTrajectory.getPosition(time) :
			ZERO_VECTOR;
		return this.position.add(parentPosition);
	}
}

class CircleTrajectory extends AbstractTrajectory {
	constructor(parentTrajectory, radius, baseAngle, angularSpeed) {
		super(parentTrajectory);
		this.radius = radius;
		this.baseAngle = baseAngle;
		this.angularSpeed = angularSpeed;
	}

	getPosition(time) {
		var parentPosition = this.parentTrajectory ?
			this.parentTrajectory.getPosition(time) :
			ZERO_VECTOR;
		var angle = this.baseAngle + this.angularSpeed * time;
		return new Vector(Math.cos(angle), Math.sin(angle)).mul(this.radius).add(parentPosition);
	}
}

const ZERO_TRAJECTORY = new StateTrajectory();