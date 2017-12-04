import spice
import kepler
import json
import math

# spice.loadKernel('kernels/de430.bsp')
spice.loadKernel('naif0012.tls')
spice.loadKernel('pck00010.tpc')
spice.loadKernel('gm_de431.tpc')

spice.loadKernel('kernels/spacecraft/voyager/voyager_1.ST+1991_a54418u.merged.bsp')

TWO_PI = 2 * math.pi

def approximateAngle(ang1, ang2, proportion):
	ang1 = ((ang1 % TWO_PI) + TWO_PI) % TWO_PI
	ang2 = ((ang2 % TWO_PI) + TWO_PI) % TWO_PI

	diff = ang2 - ang1;

	if abs(diff) > math.pi:
		diff = (diff - TWO_PI) if (diff > 0) else (diff + TWO_PI)

	return ((ang1 + diff * proportion) + TWO_PI) % TWO_PI

def approximateNumber(n1, n2, proportion):
	return n1 + (n2 - n1) * proportion

def approximateOrbit(object1, object2, epoch):
	if object2.epoch == object1.epoch:
		proportion = 0
	else:
		proportion = (epoch - object1.epoch) / (object2.epoch - object1.epoch)

	return kepler.Orbit(
		approximateNumber(object1.ecc, object2.ecc, proportion),
		approximateNumber(object1.sma, object2.sma, proportion),
		approximateAngle(object1.aop, object2.aop, proportion),
		approximateAngle(object1.inc, object2.inc, proportion),
		epoch,
		approximateNumber(object1.mu, object2.mu, proportion),
		False,
		approximateAngle(object1.loan, object2.loan, proportion),
		approximateAngle(object1.getMeanAnomalyByEpoch(epoch), object2.getMeanAnomalyByEpoch(epoch), proportion)
	);

def getStateFromSpice(parent, body, epoch):
	state = list(spice.spkezr(body, epoch, 'ECLIPJ2000', 'NONE', parent)[0])
	return kepler.StateVector(
		kepler.Vector3(state[0], state[1], state[2]),
		kepler.Vector3(state[3], state[4], state[5])
	)

def getOrbitFromSpice(parent, body, epoch, parentMu):
	return kepler.createOrbitByState(
		getStateFromSpice(parent, body, epoch),
		parentMu,
		epoch
	)

def getNextElements(parent, body, currentElements, step, maxError, maxEpoch):
	direction = False
	prevElements = False
	i = 0

	while True:
		if currentElements.epoch + step > maxEpoch:
			nextEpoch = maxEpoch
		else:
			nextEpoch = currentElements.epoch + step

		nextElements = getOrbitFromSpice(parent, body, nextEpoch, currentElements.mu)

		# print(currentElements.epoch, nextElements.epoch)

		approximatedEpoch = (currentElements.epoch + nextEpoch) / 2
		approximatedElements = approximateOrbit(currentElements, nextElements, approximatedEpoch)

		approximatedState = approximatedElements.getStateByEpoch(approximatedEpoch)
		realState = getStateFromSpice(parent, body, approximatedEpoch)

		error = realState.position.sub(approximatedState.position).mag()
		errorVel = realState.velocity.sub(approximatedState.velocity).mag()
		i += 1

		if error < maxError and errorVel / realState.velocity.mag() < 0.05:
			if direction == -1 or (nextEpoch == maxEpoch):
				break
			else:
				direction = 1
				step *= 2
		else:
			if direction == 1:
				nextElements = prevElements
				break
			else:
				direction = -1
				step /= (nextEpoch - currentElements.epoch) / 2

		if i > 10:
			break

		prevElements = nextElements

	return nextElements

def getObjectTrajectory(body, parent, etFrom, etTo, maxError, color):
	parentMu = spice.bodvrd(parent, "GM", 1)[1][0]
	lastOrbit = getOrbitFromSpice(parent, body, etFrom, parentMu)
	trajectory = [(
		lastOrbit.ecc,
		lastOrbit.sma * (1 - lastOrbit.ecc),
		lastOrbit.aop,
		lastOrbit.inc,
		lastOrbit.loan,
		lastOrbit.m0,
		lastOrbit.epoch,
		lastOrbit.mu,
	)]

	step = 86400 * 30
	i = 0

	while True:
		orbit = getNextElements(parent, body, lastOrbit, step, maxError, etTo)

		trajectory.append((
			orbit.ecc, 		# ecc
			orbit.sma * (1 - orbit.ecc), # periapsis radius
			orbit.aop, 		# aop
			orbit.inc, 		# inc
			orbit.loan, 	# raan
			orbit.m0, 		# mean anomaly
			orbit.epoch, 	# epoch
			orbit.mu, 		# mu
		))

		step = orbit.epoch - lastOrbit.epoch

		lastOrbit = orbit

		i += 1

		if lastOrbit.epoch >= etEnd:
			break

	return {
		'type': 'keplerian_array',
		'periodStart': etFrom,
		'periodEnd': etTo,
		'color': color,
		'data': {
			'referenceFrame': int(parent) * 100000 + 1000,
			'elementsArray': trajectory
		}
	}

def dumpJson(fileName, data):
    with open(fileName, 'w') as file:
        file.write(json.dumps(data))

SPICE_ID = '-31'

etStart = spice.str2et('1950 Jan 1 12:00:00 TDB')
etEnd = spice.str2et('2050 Jan 1 12:00:00 TDB')

traj1 = getObjectTrajectory(
	SPICE_ID,
	'399',
	spice.str2et('1977 SEP 05 13:59:24.383 TDB'),
	spice.str2et('1977 SEP 08 09:08:16.593 TDB'),
	100,
	'green'
)

print(traj1)