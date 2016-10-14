"use strict";

class Vector3 {
	constructor(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	abs() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	add(o) {
		return new Vector3(this.x + o.x, this.y + o.y, this.z + o.z);
	}

	sub(o) {
		return new Vector3(this.x - o.x, this.y - o.y, this.z - o.z);
	}

	mul(k) {
		return new Vector3(k * this.x, k * this.y, k * this.z);
	}

	div(k) {
		return new Vector3(this.x / k, this.y / k, this.z / k);
	}
}

const ZERO_VECTOR = new Vector3();

class StateVector {
	constructor(position, velocity) {
		this.position = position || ZERO_VECTOR;
		this.velocity = velocity || ZERO_VECTOR;
	}
}

const ZERO_STATE = new StateVector();

class StateWithTime extends StateVector {
	constructor(position, velocity, time) {
		super(position, velocity);
		this.time = time || 0;
	}
}

class StateList {
	constructor(states) {
		this.states = states || []
	}

	getPosition(time) {
		for (var i = 1; i < this.states.length; ++i) {
			var next = this.states[i];
			if (next.time > time) {
				var prev = this.states[i - 1];
				return prev.position.add(prev.velocity.mul(time - prev.time)).
					add(next.velocity.sub(prev.velocity).div(next.time - prev.time).
						mul((time - prev.time) * (time - prev.time) / 2));
			}
		}

		var state = this.states[this.states.length - 1];
		return state.position.add(state.velocity.mul(time - state.time));
	}
}
