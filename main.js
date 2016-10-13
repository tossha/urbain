var camera, scene, renderer, controls;

var sunPosition, earthOrbit;
var sun, earth;

var time;

class Trajectory
{
	constructor() {}

	get position()
	{
		return {x: 0, y: 0, z: 0};
	}

	render() {}
}


class KeplerianOrbit extends Trajectory
{
	constructor(parent, sma, e, inc, raan, aop, ta, epoch, color)
	{
		super();

		this.parentTrajectory = parent;

		this.sma    = sma;
		this.e      = e;
		this.inc    = inc;
		this.raan   = raan;
		this.aop    = aop;
		this.ta     = ta;
		this.epoch  = epoch;
		this.color  = color;

		this.obj3d = new THREE.Line(
			new THREE.Geometry(),
			new THREE.LineBasicMaterial({color: this.color})
		);

		scene.add(this.obj3d);
	}

	get position()
	{
		var r = this.sma * (1 - this.e * this.e) / (1 + this.e * Math.cos(this.ta));
		var parentPosition = this.parentTrajectory.position;

		var Rot1 = [
			[Math.cos(this.aop), -Math.sin(this.aop), 0],
			[Math.sin(this.aop),  Math.cos(this.aop), 0],
			[                 0,                   0, 1]
		];

		var Rot2 = [
			[1,                  0,                   0],
			[0, Math.cos(this.inc), -Math.sin(this.inc)],
			[0, Math.sin(this.inc),  Math.cos(this.inc)]
		];

		var Rot3 = [
			[Math.cos(this.raan), -Math.sin(this.raan), 0],
			[Math.sin(this.raan),  Math.cos(this.raan), 0],
			[                 0,                   0, 1]
		];

		var pos = [r * Math.cos(this.ta), r * Math.sin(this.ta), 0];

		pos = numeric.dot(Rot1, pos);
		pos = numeric.dot(Rot2, pos);
		pos = numeric.dot(Rot3, pos);

		return {
			x: parentPosition.x + pos[0],
			y: parentPosition.y + pos[1],
			z: parentPosition.z + pos[2]
		}
	}

	render()
	{
		var pos;
		var dr = -this.sma * this.e;
		var ang = Math.acos(
			(this.e + Math.cos(this.ta)) / (1 + this.e * Math.cos(this.ta))
		);

		if (this.ta > Math.PI) {
			ang = 2 * Math.PI - ang;
		}

		this.obj3d.geometry = (new THREE.Path(
			(new THREE.EllipseCurve(
				dr * Math.cos(this.aop),
				dr * Math.sin(this.aop),
				this.sma,
				this.sma * Math.sqrt(1 - this.e * this.e),
				ang,
				2 * Math.PI + ang,
				false,
				this.aop
			)).getPoints(100)
		)).createPointsGeometry(100).rotateX(this.inc);

		this.obj3d.rotation.z = this.raan;

		pos = this.parentTrajectory.position;
		this.obj3d.position.set(pos.x, pos.y, pos.z);
	}
}


class StaticPosition extends Trajectory
{
	constructor(x, y, z, parent)
	{
		super();

		this.parentTrajectory = parent;

		this.x = x;
		this.y = y;
		this.z = z;
	}

	get position()
	{
		var parentPosition = {x: 0, y: 0, z: 0};

		if (this.parentTrajectory) {
			parentPosition = this.parentTrajectory.position;
		}

		return {
			x: this.x + parentPosition.x,
			y: this.y + parentPosition.y,
			z: this.z + parentPosition.z
		};
	}
}


class Body
{
	constructor(name, trajectory, size, color)
	{
		var sphereGeom;

		this.name       = name;
		this.trajectory = trajectory;
		this.size       = size;
		this.color      = color;

		sphereGeom = new THREE.SphereGeometry(this.size, 16, 8);
		sphereGeom.rotateX(Math.PI / 2);

		this.obj3d = new THREE.Mesh(
			sphereGeom,
			new THREE.MeshBasicMaterial({color: this.color, wireframe: true})
		);
		scene.add(this.obj3d);
	}

	get position()
	{
		return this.trajectory.position;
	}

	render(isTrajectoryRenderingNeeded)
	{
		var pos = this.position;
		this.obj3d.position.set(pos.x, pos.y, pos.z);

		if (isTrajectoryRenderingNeeded) {
			this.trajectory.render();
		}
	}
}


function init()
{
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.x = 300;
	camera.position.y = 300;
	camera.position.z = 300;
	camera.up = new THREE.Vector3(0, 0, 1);

	scene = new THREE.Scene();

	scene.add(new THREE.AxisHelper(300));

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	controls = new THREE.OrbitControls(camera, renderer.domElement);

	document.body.appendChild(renderer.domElement);

	time = (new Date()).getTime();
}

function eccAnomaly(ec, m)
{
	var dp = 8;
	var K = Math.PI / 180.0;
	var maxIter = 30, i = 0;
	var delta = Math.pow(10, -dp);
	var E, F;

	m = m / 360.0;
	m = 2.0 * Math.PI * (m - Math.floor(m));

	if (ec < 0.8) {
		E = m;
	} else {
		E = Math.PI;
	}

	F = E - ec * Math.sin(m) - m;

	while ((Math.abs(F) > delta) && (i < maxIter)) {
		E = E - F / (1.0 - ec * Math.cos(E));
		F = E - ec * Math.sin(E) - m;
		i = i + 1;
	}

	return angle(ec, E, dp);
}

function angle(ec, E, dp)
{
	K = Math.PI / 180.0;
	S = Math.sin(E);
	C = Math.cos(E);
	fak = Math.sqrt(1.0 - ec * ec);
	phi = Math.atan2(fak * S, C - ec);
	return (phi > 0) ? phi : (phi + 2 * Math.PI);
}

function rad(degrees)
{
	return degrees * Math.PI / 180;
}

function render(curTime) {
	requestAnimationFrame(render);
	controls.update();

	earth.trajectory.ta = eccAnomaly(earth.trajectory.e, ((curTime - time) / 15) % 360);

	earth.render(false);
	renderer.render(scene, camera);
}

init();

sunPosition = new StaticPosition(0, 0, 0);
earthOrbit = new KeplerianOrbit(
	sunPosition,
	300,
	0.8,
	rad(10),  // inc
	rad(90),  // raan
	rad(90),  // aop
	rad(110), // ta
	0,
	'blue'
);

sun = new Body('Sun', sunPosition, 20, 'yellow');
earth = new Body('Earth', earthOrbit, 5, 'blue');

earth.render(true);
render(time);
