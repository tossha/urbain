"use strict";

class GravitationSource {
	constructor(gravityParameter, trajectory) {
		this.gravityParameter = gravityParameter || 0;
		this.trajectory       = trajectory       || ZERO_TRAJECTORY;
	}

	getAcceleration(position, time) {
		var vec = this.trajectory.getPosition(time).sub(position);
		var abs = vec.abs();

		return vec.mul(this.gravityParameter / abs / abs / abs);
	}
}

var gravitationSources = [];

class SkyObject {
	constructor(stateList) {
		this.stateList = stateList || new StateList();
		this.acceleration = 0;
	}

	addState(newTime) {
		var states = this.stateList.states;
		var last = states[states.length - 1];
		var acceleration = gravitationSources.
			map(s => s.getAcceleration(last.position, last.time)).
			reduce((a, b) => a.add(b));
		
		var timeDelta = newTime - last.time;
		var newVelocity = acceleration.mul(timeDelta).add(last.velocity);
		var newPosition = newVelocity.add(last.velocity).mul(timeDelta / 2).add(last.position);
		states.push(new StateWithTime(newPosition, newVelocity, newTime));
	}
}
